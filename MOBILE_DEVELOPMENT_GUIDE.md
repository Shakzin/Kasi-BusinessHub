# 📱 Kasi BusinessHub - Mobile App Development Guide

## Table of Contents
1. [Setup](#setup)
2. [Development Workflow](#development-workflow)
3. [Building for Stores](#building-for-stores)
4. [Submitting to Stores](#submitting-to-stores)
5. [Troubleshooting](#troubleshooting)

---

## Setup

### Prerequisites
- **Node.js** 18+ and npm 9+
- **Xcode** 14+ (macOS only, for iOS)
- **Android Studio** with SDK 24+ (API level 24+)
- **Capacitor CLI** 5.0+

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Install Capacitor (when network is available)
npm install @capacitor/core @capacitor/cli
npm install --save-dev @capacitor/android @capacitor/ios

# 3. Initialize Capacitor
npx cap init

# 4. Add platforms
npx cap add android
npx cap add ios

# 5. Build web app
npm run build

# 6. Sync web app to native projects
npx cap sync
```

### Project Structure
```
kasi-businesshub/
├── src/                    # React source code
├── dist/                   # Built web app (generated)
├── android/                # Android native code
├── ios/                    # iOS native code
├── capacitor.config.ts     # Capacitor configuration
├── package.json            # Dependencies & scripts
└── APP_STORE_LAUNCH_GUIDE.md  # This guide
```

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Sync changes to mobile (watch mode)
npx cap sync --watch

# Terminal 3: Run on Android emulator
cd android
./gradlew installDebug
```

### Testing Changes

```bash
# After making code changes:

# 1. Build the web app
npm run build

# 2. Sync to mobile platforms
npx cap sync

# 3. Rebuild native projects
cd android && ./gradlew clean && ./gradlew assembleDebug
cd ios && xcodebuild clean build -workspace App.xcworkspace -scheme App
```

### Adding Native Plugins

```bash
# Example: Add camera plugin
npm install @capacitor/camera

# Sync to native projects
npx cap sync
```

### Debugging

```bash
# Android debugging
cd android
./gradlew installDebug
# Then use Android Studio logcat or:
adb logcat | grep capacitor

# iOS debugging
cd ios
xcodebuild test -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## Building for Stores

### Android Build

#### Generate Keystore (First Time Only)
```bash
keytool -genkey -v -keystore kasi-businesshub-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias kasi-businesshub-key \
  -storepass YourPassword \
  -keypass YourPassword \
  -dname "CN=Kasi BusinessHub,O=Kasi,C=ZA"

# IMPORTANT: Back this up securely! You'll need it for future updates.
```

#### Build AAB (for Play Store - Recommended)
```bash
# 1. Build web app
npm run build

# 2. Update version in capacitor.config.ts and android/app/build.gradle
# 3. Sync to Android
npx cap sync android

# 4. Build AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

#### Build APK (for Testing)
```bash
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### iOS Build

#### Prerequisites
- Apple Developer Account ($99/year)
- Development & Distribution Certificates
- App ID & Provisioning Profiles

#### Build Archive (for App Store)
```bash
# 1. Build web app
npm run build

# 2. Update version in capacitor.config.ts and Xcode
# 3. Sync to iOS
npx cap sync ios

# 4. Open Xcode
cd ios
open App.xcworkspace

# 5. In Xcode:
# - Select "Product" > "Archive"
# - Wait for archive to complete
# - Organizer window opens
# - Select archive > "Distribute App"
# - Choose "App Store" distribution method
# - Follow the wizard
```

#### Build for Testing
```bash
cd ios
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug
```

---

## Submitting to Stores

### Google Play Store

#### Step 1: Create Listing
```
Go to: https://play.google.com/console/
1. Create new app
2. Fill in app details:
   - Title: "Kasi BusinessHub"
   - Short description: "Manage your business, organize events, reach customers"
   - Category: Business
   - Content rating: 4+
```

#### Step 2: Upload Build
```
1. Go to "Release" > "Production"
2. Create new release
3. Upload AAB file (from android/app/build/outputs/bundle/release/)
4. Review & publish
5. Estimated review: 48-72 hours
```

#### Step 3: Complete Metadata
- [ ] Description (500+ characters)
- [ ] Screenshots (5-8 images)
- [ ] Icon (512x512px)
- [ ] Feature graphic (1024x500px)
- [ ] Privacy policy URL
- [ ] Terms URL

### Apple App Store

#### Step 1: Create App Record
```
Go to: https://appstoreconnect.apple.com/
1. Apps > Create New App
2. Bundle ID: com.kasibusinesshub.app
3. Select platforms (iOS, iPadOS)
4. App name: "Kasi BusinessHub"
```

#### Step 2: Upload Build
```
Option A: Via Xcode
1. Product > Archive
2. Organizer > Distribute App
3. Choose "App Store"
4. Follow wizard

Option B: Via Transporter
1. Download Apple Transporter
2. Create package with Xcode
3. Upload via Transporter
```

#### Step 3: Complete Information
- [ ] Description & Subtitle
- [ ] Keywords
- [ ] Screenshots (5-8 images)
- [ ] App preview video (optional)
- [ ] Privacy policy URL
- [ ] Support URL

#### Step 4: Submit for Review
```
1. Go to App Store Connect
2. Version > Prepare for Submission
3. Fill in review information:
   - Demo account (if needed)
   - Notes for reviewer
   - Contact information
4. Submit for Review
5. Estimated review: 24 hours - 1 week
```

---

## Version Management

### Update Version Number

#### In capacitor.config.ts:
```typescript
const config: CapacitorConfig = {
  appId: 'com.kasibusinesshub.app',
  appName: 'Kasi BusinessHub',
  webDir: 'dist',
  // Update after each release
};
```

#### In Android (android/app/build.gradle):
```gradle
versionCode 1        // Increment by 1 for each build
versionName "1.0.0"  // Semantic versioning
```

#### In iOS (Xcode):
```
Project > Targets > App > General
Bundle Identifier: com.kasibusinesshub.app
Version: 1.0.0
Build: 1
```

#### In package.json:
```json
{
  "version": "1.0.0"
}
```

### Release Checklist
- [ ] Version number updated everywhere
- [ ] Changelog written
- [ ] Build tested on devices
- [ ] All features working
- [ ] Performance optimized
- [ ] Screenshots updated (if needed)
- [ ] Ready for submission

---

## Troubleshooting

### Common Issues

#### Build Fails on Android
```bash
# Clean build
cd android
./gradlew clean
./gradlew bundleRelease

# If still failing, check:
# 1. Android SDK path set correctly
# 2. Java version 11 or 17
# 3. Gradle version matches
```

#### iOS Code Signing Error
```bash
# Fix signing issues
cd ios
pod deintegrate
pod install

# In Xcode:
# 1. Select team in Signing & Capabilities
# 2. Fix provisioning profile warnings
# 3. Try Product > Clean Build Folder
# 4. Then Archive again
```

#### App Crashes on Startup
```bash
# Check logs
# Android:
adb logcat | grep capacitor

# iOS:
# Console app > Device > Logs

# Common causes:
# 1. Missing permissions in manifest/plist
# 2. API keys not configured
# 3. Network URL unreachable
# 4. Environment variables not set
```

#### Build Size Too Large
```bash
# Analyze size
cd android
./gradlew bundleAnalyze

# Reduce size:
# 1. Remove unused dependencies
# 2. Optimize images (< 100KB each)
# 3. Enable ProGuard/R8 minification
# 4. Remove debug symbols (release builds)
```

#### Performance Issues
```bash
# Profile app
# Android Studio: Profiler > CPU, Memory, Network

# iOS: Instruments
# Product > Profile
# Select Time Profiler or Memory Leaks

# Common optimizations:
# 1. Lazy load images
# 2. Virtual scrolling for lists
# 3. Memoize components
# 4. Remove console.logs
# 5. Optimize bundle size
```

---

## Performance Targets

**Ideal Metrics:**
- App launch time: < 3 seconds
- Screen transitions: < 500ms
- List scrolling: 60 FPS
- Memory usage: < 200MB
- App size: < 100MB (Android), < 150MB (iOS)
- Battery drain: < 5% per hour

---

## Security Checklist

- [ ] No hardcoded API keys
- [ ] API endpoints use HTTPS
- [ ] Authentication tokens secure
- [ ] User data encrypted
- [ ] No sensitive logs in production
- [ ] Dependencies regularly updated
- [ ] Security vulnerabilities addressed
- [ ] Privacy policy compliant

---

## Useful Commands

```bash
# Development
npm run dev                  # Start dev server
npm run build              # Build web app
npx cap sync              # Sync to mobile
npx cap open android      # Open Android Studio
npx cap open ios          # Open Xcode

# Building
npm run build:mobile      # Build + sync
npm run android:bundle    # Build Android AAB
npm run ios:archive       # Build iOS archive

# Testing
npm run lint              # Run linter
npm run check             # TypeScript check
npm run test              # Run tests

# Versioning
npm run version:bump -- --new-version 1.1.0
```

---

## Resources

- 📚 [Capacitor Documentation](https://capacitorjs.com/docs)
- 📱 [Android Developers](https://developer.android.com)
- 🍎 [Apple Developer](https://developer.apple.com)
- 🎯 [Google Play Console](https://play.google.com/console)
- 📦 [App Store Connect](https://appstoreconnect.apple.com)

---

## Support

For issues or questions:
- GitHub Issues: [Add repo URL]
- Email: dev@kasibusinesshub.com
- Documentation: `/docs`

---

**Happy coding! 🚀**
