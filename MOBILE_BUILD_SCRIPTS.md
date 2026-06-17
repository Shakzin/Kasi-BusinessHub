# Build & Release Scripts for App Store

Add these scripts to your `package.json` for easier app store preparation:

```json
{
  "scripts": {
    "build": "vite build && esbuild api/boot.ts --platform=node --bundle --format=esm --outdir=dist --banner:js=\"import { createRequire } from 'module';const require = createRequire(import.meta.url);\"",
    
    "build:mobile": "npm run build && npx cap sync",
    
    "android:build": "cd android && ./gradlew bundleRelease",
    
    "android:build-apk": "cd android && ./gradlew assembleRelease",
    
    "android:sign": "jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore kasi-businesshub-release.keystore android/app/build/outputs/bundle/release/app-release.aab kasi-businesshub-key",
    
    "android:bundle": "npm run build && npx cap sync android && npm run android:build",
    
    "ios:build": "cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -derivedDataPath build",
    
    "ios:archive": "cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -archivePath build/App.xcarchive archive",
    
    "mobile:prepare": "npm run build:mobile && npm run android:bundle",
    
    "mobile:test-android": "cd android && ./gradlew installDebug",
    
    "mobile:test-ios": "cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug -destination 'generic/platform=iOS' build",
    
    "release:prepare": "npm run lint && npm run check && npm run build:mobile",
    
    "version:bump": "npm version --no-git-tag-version"
  },
  
  "devDependencies": {
    "@capacitor/cli": "^5.x.x",
    "@capacitor/core": "^5.x.x",
    "@capacitor/android": "^5.x.x",
    "@capacitor/ios": "^5.x.x"
  }
}
```

## Usage

### For Development
```bash
# Build web app and sync to mobile
npm run build:mobile

# Test on Android emulator
npm run mobile:test-android

# Test on iOS simulator
npm run mobile:test-ios
```

### For Release Preparation
```bash
# Run all checks and build
npm run release:prepare

# Create Android Bundle (AAB for Play Store)
npm run android:bundle

# Create iOS Archive (for App Store)
npm run ios:archive
```

### Version Management
```bash
# Bump to next version
npm run version:bump -- --new-version 1.1.0
```
