#!/usr/bin/env node
// Fails when the Ticketmaster Ignite iOS SDK version differs between
//   - package.json `tmIgniteVersion` (read by react-native-ticketmaster-ignite.podspec), and
//   - Package.swift `ticketmasterSDKVersion` (the SwiftPM pin for iOS-TicketmasterSDK).
// CocoaPods and SwiftPM users must get the same SDK binaries.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pkg = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);
const manifest = fs.readFileSync(path.join(root, 'Package.swift'), 'utf8');

const podVersion = pkg.tmIgniteVersion;
const match = manifest.match(/^let ticketmasterSDKVersion = "([^"]+)"$/m);
const spmVersion = match && match[1];

if (!podVersion) {
  console.error(
    'check-tm-sdk-version: package.json has no "tmIgniteVersion" field'
  );
  process.exit(1);
}
if (!spmVersion) {
  console.error(
    'check-tm-sdk-version: Package.swift has no `let ticketmasterSDKVersion = "..."` line'
  );
  process.exit(1);
}
if (podVersion !== spmVersion) {
  console.error(
    `check-tm-sdk-version: Ticketmaster SDK version mismatch: package.json tmIgniteVersion=${podVersion}, Package.swift ticketmasterSDKVersion=${spmVersion}`
  );
  process.exit(1);
}
console.log(`check-tm-sdk-version: OK (Ticketmaster Ignite SDK ${podVersion})`);
