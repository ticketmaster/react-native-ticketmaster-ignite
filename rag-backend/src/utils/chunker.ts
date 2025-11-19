export interface DocumentChunk {
  text: string;
  metadata: {
    path: string;
    heading?: string;
    source: string;
    platform?: string;
    sdk?: string;
    concepts?: string[];
  };
}

export interface ChunkingOptions {
  chunkSize: number; // Target size in characters
  chunkOverlap: number; // Overlap in characters
}

/**
 * Extract metadata from content based on keywords
 */
export function extractMetadata(text: string, path: string): {
  platform?: string;
  sdk?: string;
  concepts: string[];
} {
  const lower = text.toLowerCase();
  const concepts: string[] = [];

  // Platform detection
  let platform: string | undefined;
  if (path.includes('/ios/') || lower.includes('ios') || lower.includes('swift')) {
    platform = 'ios';
  } else if (path.includes('/android/') || lower.includes('android') || lower.includes('kotlin')) {
    platform = 'android';
  } else if (lower.includes('expo')) {
    platform = 'expo';
  }

  // SDK detection
  let sdk: string | undefined;
  if (lower.includes('retail') || lower.includes('purchase') || lower.includes('prepurchase')) {
    sdk = 'Retail';
  } else if (lower.includes('tickets') && !lower.includes('ticketmaster')) {
    sdk = 'Tickets';
  } else if (lower.includes('accounts')) {
    sdk = 'Accounts';
  }

  // Concept extraction
  const conceptKeywords = [
    'auth',
    'authentication',
    'token',
    'deeplink',
    'scheme',
    'config',
    'analytics',
    'event',
    'modal',
    'embedded',
    'secure entry',
    'member info',
    'login',
    'logout',
    'refresh',
    'market domain',
    'region',
    'prebuilt modules',
    'event header',
    'installation',
    'setup',
    'configuration',
    'migration',
    'troubleshooting',
  ];

  for (const keyword of conceptKeywords) {
    if (lower.includes(keyword)) {
      concepts.push(keyword);
    }
  }

  return {
    platform,
    sdk,
    concepts: [...new Set(concepts)], // Remove duplicates
  };
}

/**
 * Split markdown content into semantic chunks
 */
export function chunkMarkdown(
  content: string,
  path: string,
  source: string,
  options: ChunkingOptions
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];

  // Split by markdown headings while preserving hierarchy
  const headingSections = splitByHeadings(content);

  for (const section of headingSections) {
    const { heading, content: sectionContent } = section;

    // If section is small enough, keep it as one chunk
    if (sectionContent.length <= options.chunkSize) {
      const metadata = extractMetadata(sectionContent, path);
      chunks.push({
        text: sectionContent.trim(),
        metadata: {
          path,
          heading,
          source,
          ...metadata,
        },
      });
      continue;
    }

    // Otherwise, split into smaller chunks with overlap
    const subChunks = splitWithOverlap(sectionContent, options);

    for (const chunk of subChunks) {
      const metadata = extractMetadata(chunk, path);
      chunks.push({
        text: chunk.trim(),
        metadata: {
          path,
          heading,
          source,
          ...metadata,
        },
      });
    }
  }

  return chunks;
}

/**
 * Split content by markdown headings
 */
function splitByHeadings(content: string): Array<{ heading?: string; content: string }> {
  const sections: Array<{ heading?: string; content: string }> = [];
  const lines = content.split('\n');

  let currentHeading: string | undefined;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      // Save previous section
      if (currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n'),
        });
        currentContent = [];
      }

      // Start new section
      currentHeading = headingMatch[2];
      currentContent.push(line);
    } else {
      currentContent.push(line);
    }
  }

  // Add final section
  if (currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n'),
    });
  }

  return sections;
}

/**
 * Split content into chunks with overlap
 */
function splitWithOverlap(content: string, options: ChunkingOptions): string[] {
  const chunks: string[] = [];

  // Try to split by paragraphs first
  const paragraphs = content.split(/\n\n+/);

  let currentChunk = '';
  let lastChunk = '';

  for (const para of paragraphs) {
    const proposedChunk = currentChunk + (currentChunk ? '\n\n' : '') + para;

    if (proposedChunk.length > options.chunkSize && currentChunk.length > 0) {
      // Current chunk is full, save it
      const chunkWithOverlap = lastChunk
        ? getOverlap(lastChunk, options.chunkOverlap) + currentChunk
        : currentChunk;

      chunks.push(chunkWithOverlap);
      lastChunk = currentChunk;
      currentChunk = para;
    } else {
      currentChunk = proposedChunk;
    }
  }

  // Add final chunk
  if (currentChunk.length > 0) {
    const chunkWithOverlap = lastChunk
      ? getOverlap(lastChunk, options.chunkOverlap) + currentChunk
      : currentChunk;

    chunks.push(chunkWithOverlap);
  }

  return chunks;
}

/**
 * Get the last N characters as overlap
 */
function getOverlap(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) {
    return text;
  }

  // Try to find a natural break point (space, newline)
  const substring = text.slice(-overlapSize);
  const lastBreak = Math.max(
    substring.indexOf('\n'),
    substring.indexOf('. '),
    substring.indexOf(' ')
  );

  if (lastBreak > 0) {
    return text.slice(-(overlapSize - lastBreak));
  }

  return substring;
}

/**
 * Clean and normalize markdown content
 */
export function normalizeMarkdown(content: string): string {
  // Remove excessive whitespace
  content = content.replace(/\n{3,}/g, '\n\n');

  // Normalize list formatting
  content = content.replace(/^\s*[-*+]\s+/gm, '- ');

  // Normalize code blocks
  content = content.replace(/```(\w+)?\n/g, '```$1\n');

  return content.trim();
}

/**
 * Extract text from TSX/TypeScript files (comments and JSDoc)
 */
export function extractCodeDocumentation(code: string): string {
  const docs: string[] = [];

  // Extract JSDoc comments
  const jsDocRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
  let match;

  while ((match = jsDocRegex.exec(code)) !== null) {
    const comment = match[1]
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, ''))
      .join('\n')
      .trim();

    if (comment) {
      docs.push(comment);
    }
  }

  // Extract single-line comments at the top of functions/exports
  const singleLineRegex = /\/\/\s*(.+)\n\s*(?:export\s+)?(?:function|const|class)/g;

  while ((match = singleLineRegex.exec(code)) !== null) {
    docs.push(match[1].trim());
  }

  return docs.join('\n\n');
}
