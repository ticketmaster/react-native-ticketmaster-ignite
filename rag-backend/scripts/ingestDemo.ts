import { vectorStore } from '../src/services/vectorStore';

/**
 * Demo ingestion script that uses mock embeddings
 * This allows testing the RAG system without OpenAI API calls
 */

// Generate a random embedding vector
function generateMockEmbedding(seed: string): number[] {
  const embedding: number[] = [];
  let hash = 0;

  // Simple hash function to make embeddings consistent for the same seed
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }

  // Generate 1536 dimensions (text-embedding-3-small size)
  for (let i = 0; i < 1536; i++) {
    const x = Math.sin(hash + i) * 10000;
    embedding.push(x - Math.floor(x));
  }

  // Normalize to unit length (required for cosine similarity)
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

async function ingestDemoData() {
  console.log('🎭 Starting DEMO ingestion with mock embeddings\n');
  console.log('This populates the database with sample documentation');
  console.log('so you can test the RAG API without OpenAI credits.\n');

  const demoDocuments = [
    // Installation & Setup
    {
      text: `# Installation

Install the react-native-ticketmaster-ignite library using npm or yarn:

\`\`\`bash
npm install react-native-ticketmaster-ignite
# or
yarn add react-native-ticketmaster-ignite
\`\`\`

For Expo projects, you'll also need to install the config plugin:

\`\`\`bash
npx expo install react-native-ticketmaster-ignite
\`\`\`

After installation, run pod install for iOS:

\`\`\`bash
cd ios && pod install
\`\`\``,
      metadata: {
        path: 'README.md',
        heading: 'Installation',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: undefined,
        concepts: ['installation', 'setup'],
      },
    },

    // Android Configuration
    {
      text: `# Android Configuration

To configure Android, you need to:

1. Add the scheme to your AndroidManifest.xml:

\`\`\`xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yourscheme" />
  </intent-filter>
</activity>
\`\`\`

2. Set the minimum SDK version to 24 in build.gradle:

\`\`\`gradle
android {
    defaultConfig {
        minSdkVersion 24
    }
}
\`\`\``,
      metadata: {
        path: 'README.md',
        heading: 'Android Setup',
        source: 'react-native-ticketmaster-ignite',
        platform: 'android',
        sdk: undefined,
        concepts: ['android', 'config', 'scheme', 'setup'],
      },
    },

    // Multiple Schemes for Android
    {
      text: `# Multiple Schemes (Android)

For Android, you can configure multiple Archtics schemes by adding them to your strings.xml file:

\`\`\`xml
<resources>
    <string name="archtics_schemes">yourscheme1,yourscheme2,yourscheme3</string>
</resources>
\`\`\`

Then reference this in your AndroidManifest.xml for each scheme you want to support. Each scheme will allow deep linking into your app from different sources.`,
      metadata: {
        path: 'README.md',
        heading: 'Multi Scheme',
        source: 'react-native-ticketmaster-ignite',
        platform: 'android',
        sdk: undefined,
        concepts: ['android', 'scheme', 'deeplink', 'config'],
      },
    },

    // iOS Configuration
    {
      text: `# iOS Configuration

For iOS, add the URL scheme to your Info.plist:

\`\`\`xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourscheme</string>
    </array>
  </dict>
</array>
\`\`\`

Also ensure your iOS deployment target is set to iOS 14.0 or higher in your Podfile:

\`\`\`ruby
platform :ios, '14.0'
\`\`\``,
      metadata: {
        path: 'README.md',
        heading: 'iOS Setup',
        source: 'react-native-ticketmaster-ignite',
        platform: 'ios',
        sdk: undefined,
        concepts: ['ios', 'config', 'scheme', 'setup'],
      },
    },

    // Expo Setup
    {
      text: `# Expo Configuration

To use with Expo, create an app.config.js with the Ignite config plugin:

\`\`\`javascript
export default {
  plugins: [
    [
      'react-native-ticketmaster-ignite',
      {
        ios: {
          deploymentTarget: '14.0',
        },
        android: {
          minSdkVersion: 24,
          schemes: ['yourscheme'],
        },
      },
    ],
  ],
};
\`\`\`

Then run:

\`\`\`bash
npx expo prebuild
\`\`\``,
      metadata: {
        path: 'docs/expo.md',
        heading: 'Expo Setup',
        source: 'react-native-ticketmaster-ignite',
        platform: 'expo',
        sdk: undefined,
        concepts: ['expo', 'config', 'setup'],
      },
    },

    // Accounts SDK Authentication
    {
      text: `# Accounts SDK - Authentication

The Accounts SDK provides authentication functionality. To use it:

\`\`\`tsx
import { useIgnite } from 'react-native-ticketmaster-ignite';

function MyComponent() {
  const { login, logout, getMemberInfo, refreshToken } = useIgnite();

  const handleLogin = async () => {
    try {
      const result = await login();
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <Button onPress={handleLogin} title="Login" />;
}
\`\`\`

The login function opens the Ticketmaster authentication flow and returns user credentials.`,
      metadata: {
        path: 'README.md',
        heading: 'Accounts SDK',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: 'Accounts',
        concepts: ['auth', 'authentication', 'login', 'token'],
      },
    },

    // Retail SDK
    {
      text: `# Retail SDK - Purchase Flow

The Retail SDK handles event ticket purchases. To present the purchase flow:

\`\`\`tsx
import { RetailSDK } from 'react-native-ticketmaster-ignite';

<RetailSDK
  eventId="your-event-id"
  onPurchaseComplete={(data) => {
    console.log('Purchase completed:', data);
  }}
  onClose={() => {
    console.log('Purchase flow closed');
  }}
/>
\`\`\`

You must authenticate users with the Accounts SDK before they can make purchases.`,
      metadata: {
        path: 'README.md',
        heading: 'Retail SDK',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: 'Retail',
        concepts: ['purchase', 'retail', 'event'],
      },
    },

    // Tickets SDK - Modal
    {
      text: `# Tickets SDK - Modal View (iOS Only)

The modal tickets view is iOS-only and displays tickets in a full-screen modal:

\`\`\`tsx
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';

<TicketsSdkModal
  visible={showTickets}
  onClose={() => setShowTickets(false)}
  onError={(error) => console.error(error)}
/>
\`\`\`

This component automatically fetches and displays the user's tickets in a native iOS modal presentation.`,
      metadata: {
        path: 'README.md',
        heading: 'Tickets SDK Modal',
        source: 'react-native-ticketmaster-ignite',
        platform: 'ios',
        sdk: 'Tickets',
        concepts: ['tickets', 'modal', 'ios'],
      },
    },

    // Tickets SDK - Embedded
    {
      text: `# Tickets SDK - Embedded View

The embedded tickets view works on both iOS and Android:

\`\`\`tsx
import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

<TicketsSdkEmbedded
  style={{ flex: 1 }}
  onTicketPressed={(ticketId) => {
    console.log('Ticket pressed:', ticketId);
  }}
/>
\`\`\`

This displays the user's tickets inline within your app's UI, allowing for more flexible layouts.`,
      metadata: {
        path: 'README.md',
        heading: 'Tickets SDK Embedded',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: 'Tickets',
        concepts: ['tickets', 'embedded'],
      },
    },

    // Analytics
    {
      text: `# Analytics Events

The library emits analytics events that you can track:

\`\`\`tsx
import { IgniteAnalytics } from 'react-native-ticketmaster-ignite';

<IgniteProvider
  onAnalytics={(event) => {
    console.log('Analytics event:', event.name, event.data);

    // Track events in your analytics service
    if (event.name === IgniteAnalytics.LOGIN_SUCCESS) {
      myAnalytics.track('User logged in');
    }
  }}
>
  {/* Your app */}
</IgniteProvider>
\`\`\`

Available events include: LOGIN_SUCCESS, LOGIN_FAILED, PURCHASE_SUCCESS, TICKET_VIEWED, and more.`,
      metadata: {
        path: 'docs/analytics.md',
        heading: 'Analytics',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: undefined,
        concepts: ['analytics', 'event', 'tracking'],
      },
    },

    // Secure Entry
    {
      text: `# Secure Entry

Display ticket barcodes for venue entry:

\`\`\`tsx
import { SecureEntry } from 'react-native-ticketmaster-ignite';

<SecureEntry
  ticketId="your-ticket-id"
  onError={(error) => console.error(error)}
  style={{ height: 400 }}
/>
\`\`\`

The SecureEntry component shows the animated barcode that venue scanners use for entry. The barcode refreshes periodically for security.`,
      metadata: {
        path: 'README.md',
        heading: 'Secure Entry',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: undefined,
        concepts: ['secure entry', 'barcode', 'tickets'],
      },
    },

    // Tokens & Authentication
    {
      text: `# Token Management

After authentication, tokens are managed differently on iOS and Android:

**iOS**: The \`login()\` function returns a \`TMAuthentication\` object containing the access token and member info.

**Android**: The \`login()\` function returns a \`UserInfo\` object. The token is automatically managed by the SDK.

To refresh tokens:

\`\`\`tsx
const newToken = await refreshToken();
\`\`\`

Tokens expire after a certain period, so implement proper refresh logic in your app.`,
      metadata: {
        path: 'README.md',
        heading: 'Authentication',
        source: 'react-native-ticketmaster-ignite',
        platform: undefined,
        sdk: 'Accounts',
        concepts: ['token', 'auth', 'authentication', 'refresh'],
      },
    },
  ];

  console.log(`Processing ${demoDocuments.length} demo documents...\n`);

  // Generate embeddings and store
  for (const doc of demoDocuments) {
    const embedding = generateMockEmbedding(doc.text);

    await vectorStore.upsertDocument({
      embedding,
      text: doc.text,
      metadata: doc.metadata,
    });

    console.log(`✓ Stored: ${doc.metadata.path} > ${doc.metadata.heading}`);
  }

  console.log(`\n✅ Demo ingestion completed!`);
  console.log(`\nIngested ${demoDocuments.length} documents with mock embeddings.`);

  // Get stats
  const stats = await vectorStore.getStats();
  console.log(`\nDatabase statistics:`);
  console.log(`  Total documents: ${stats.totalDocuments}`);
  console.log(`  By platform:`, stats.byPlatform);
  console.log(`  By SDK:`, stats.bySdk);

  await vectorStore.close();
}

ingestDemoData().catch((error) => {
  console.error('Demo ingestion failed:', error);
  process.exit(1);
});
