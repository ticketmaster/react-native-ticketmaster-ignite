#!/usr/bin/env bash
# Converts the example app to React Native's Swift Package Manager mode (RN 0.88+).
# Used by CI (`build-ios-spm`) and documented in CONTRIBUTING.md. Reverse with
# `npx react-native spm deinit && git checkout -- . && pod install` from example/ios.
set -euo pipefail

cd "$(dirname "$0")/../ios"

# Stale codegen from CocoaPods builds (and the previous SwiftPM run) confuses React Native's
# per-app header merge, which walks this whole monorepo as the library root.
rm -rf build/generated build/.react-app-headers.tmp

# Generate Package.swift for example dependencies that ship none (react-native-config,
# react-native-screens). Libraries with their own manifest, including ours, are left alone.
npx react-native spm scaffold

# react-native-screens 4.x: the scaffolder misses the `common` subspec's header_dir
# ("rnscreens"), so `#import <rnscreens/...>` cannot resolve. Add the namespace root.
# Remove once react-native-screens ships its own Package.swift in a stable release
# (it is already on its main branch).
RNS_MANIFEST=../node_modules/react-native-screens/Package.swift
if [ -f "$RNS_MANIFEST" ] && grep -q 'AUTO-SCAFFOLDED-VERSION' "$RNS_MANIFEST" \
   && ! grep -q 'headerSearchPath("common/cpp/react/renderer/components")' "$RNS_MANIFEST"; then
  perl -pi -e 's/\.headerSearchPath\("common\/cpp"\), /.headerSearchPath("common\/cpp"), .headerSearchPath("common\/cpp\/react\/renderer\/components"), /g' "$RNS_MANIFEST"
  echo "spm-prepare: patched react-native-screens scaffold header search paths"
fi

# CocoaPods compiles every pod with RCT_NEW_ARCH_ENABLED=1 (install_modules_dependencies); the
# scaffolder does not, so scaffolded modules build their legacy (non-TurboModule) variants and
# React Native rejects them at startup ("does not conform to RCTModuleProvider"). Mirror the define.
for pkg in react-native-config react-native-screens; do
  m=../node_modules/$pkg/Package.swift
  if [ -f "$m" ] && grep -q 'AUTO-SCAFFOLDED-VERSION' "$m" && ! grep -q 'RCT_NEW_ARCH_ENABLED' "$m"; then
    perl -pi -e 's/(c(?:xx)?Settings: \[)/$1.define("RCT_NEW_ARCH_ENABLED", to: "1"), /g' "$m"
    echo "spm-prepare: added RCT_NEW_ARCH_ENABLED to $pkg scaffold"
  fi
done

# react-native-config imports its codegen spec header with quotes (`#import "RNCConfigSpec.h"`), which
# only resolves through CocoaPods header maps. SwiftPM needs the namespaced form.
RNC_HEADER=../node_modules/react-native-config/ios/ReactNativeConfig/RNCConfigModule.h
if [ -f "$RNC_HEADER" ] && grep -q "#import \"RNCConfigSpec.h\"" "$RNC_HEADER"; then
  perl -pi -e "s{#import \"RNCConfigSpec.h\"}{#import <RNCConfigSpec/RNCConfigSpec.h>}" "$RNC_HEADER"
  echo "spm-prepare: namespaced react-native-config spec import"
fi

npx react-native spm add --deintegrate --yes
