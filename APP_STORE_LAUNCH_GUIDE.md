# Kasi BusinessHub - App Store Launch Guide

## 🚀 Complete Preparation for Google Play Store & Apple App Store

---

## Phase 1: Setup Capacitor for Native Apps

### 1.1 Install Capacitor (when network is available)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init

# When prompted:
# App name: Kasi BusinessHub
# App Package ID: com.kasibusinesshub.app
# Directory: web
```

### 1.2 Install Platform SDKs
```bash
# For Android
npm install @capacitor/android
npx cap add android

# For iOS
npm install @capacitor/ios
npx cap add ios
```

### 1.3 Build Web App
```bash
npm run build
```

---

## Phase 2: App Metadata & Configuration

### 2.1 Update capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kasibusinesshub.app',
  appName: 'Kasi BusinessHub',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
    },
  }
};

export default config;
```

### 2.2 Required App Icons
Generate icons at these sizes:
- **Android**: 192x192px (mdpi), 144x144px (hdpi), 96x96px (xhdpi), 72x72px (xxhdpi), 48x48px (xxxhdpi)
- **iOS**: 1024x1024px (App Store), 180x180px (iPhone), 167x167px (iPad Pro), 152x152px (iPad), 120x120px (iPhone)

Place in:
- Android: `android/app/src/main/res/`
- iOS: `ios/App/App/Assets.xcassets/`

### 2.3 Splash Screen
- **Recommended Size**: 2732x2732px
- **Format**: PNG or SVG
- **Colors**: Match brand purple (#4F46E5) and cream (#FAFAF8)

---

## Phase 3: Google Play Store Requirements

### 3.1 Android App Signing
```bash
# Navigate to Android project
cd android

# Generate keystore (one-time)
keytool -genkey -v -keystore kasi-businesshub-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias kasi-businesshub-key

# Store credentials securely - needed for future updates!
```

### 3.2 Android Build Release
```bash
cd android

# Build signed APK
./gradlew assembleRelease

# Build signed AAB (recommended for Play Store)
./gradlew bundleRelease
```

### 3.3 Google Play Store Metadata
**App Title**: Kasi BusinessHub
**Short Description** (80 chars):
```
Manage your business, organize events, reach customers
```

**Full Description**:
```
Kasi BusinessHub is South Africa's leading business management platform. 
Create stunning business profiles, organize events, and connect with your 
customers - all from one beautiful dashboard.

FEATURES:
• Manage multiple business profiles
• Create and organize events
• Real-time analytics & insights
• Priority customer support
• Custom domain support
• Mobile-optimized platform

Perfect for small businesses, entrepreneurs, and growing companies across 
South Africa. Start your free trial today!
```

**Category**: Business
**Content Rating**: 4+
**Pricing**: Free with in-app purchases (subscriptions)

### 3.4 Screenshots (5-8 required)
- Dashboard overview
- Event management
- Business profiles
- Analytics
- Mobile responsiveness demo
- Pricing plans
- Feature highlights
- Customer testimonial

**Dimensions**: 1080x1920px (portrait) or 1920x1080px (landscape)

### 3.5 Privacy Policy & Terms
Required URLs:
- Privacy Policy: `https://kasibusinesshub.com/privacy`
- Terms of Service: `https://kasibusinesshub.com/terms`
- Support Email: `support@kasibusinesshub.com`

---

## Phase 4: Apple App Store Requirements

### 4.1 iOS App Signing

**Prerequisites:**
- Apple Developer Account ($99/year)
- Certificate Signing Request (CSR)
- App ID & Bundle Identifier: `com.kasibusinesshub.app`

**Steps:**
1. Create App ID in Apple Developer Console
2. Generate Development Certificate
3. Create Provisioning Profile
4. Add to Xcode Keychain

### 4.2 iOS Build Release
```bash
# Open iOS project
cd ios
open App.xcworkspace

# In Xcode:
# 1. Select "Product" > "Scheme" > "App"
# 2. Set deployment target to iOS 13.0+
# 3. Select "Product" > "Build For" > "Running"
# 4. Archive for distribution
```

### 4.3 App Store Metadata
**App Name**: Kasi BusinessHub
**Subtitle** (30 chars): Business Management for SA
**Description** (same as Google Play)
**Keywords**: business, events, south africa, management, entrepreneur
**Support URL**: `https://kasibusinesshub.com/support`
**Privacy Policy URL**: `https://kasibusinesshub.com/privacy`

### 4.4 App Store Screenshots
Same as Google Play (optimized aspect ratio):
- **iPhone 6.5"**: 1242x2688px
- **iPad Pro 12.9"**: 2048x2732px

### 4.5 TestFlight Beta Testing (Recommended)
Before App Store submission:
1. Upload build to TestFlight
2. Add 25+ testers
3. Collect feedback for 2 weeks
4. Fix critical issues
5. Submit for review

---

## Phase 5: App Configuration

### 5.1 AndroidManifest.xml Updates
```xml
<?xml version='1.0' encoding='utf-8'?>
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <application android:theme="@style/AppTheme" android:icon="@mipmap/ic_launcher">
        <activity android:name="com.kasibusinesshub.MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 5.2 Info.plist Updates (iOS)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Kasi BusinessHub</string>
    <key>CFBundleIdentifier</key>
    <string>com.kasibusinesshub.app</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>NSCameraUsageDescription</key>
    <string>Camera access needed for business profile photos</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Photo library access for uploading images</string>
    <key>NSLocalNetworkUsageDescription</key>
    <string>Network access required for app functionality</string>
    <key>NSBonjourServices</key>
    <array>
        <string>_http._tcp</string>
    </array>
</dict>
</plist>
```

### 5.3 Capacitor Plugins to Install
```bash
npm install \
  @capacitor/camera \
  @capacitor/storage \
  @capacitor/app \
  @capacitor/device \
  @capacitor/keyboard \
  @capacitor/toast

npx cap sync
```

---

## Phase 6: Pre-Launch Checklist

### 6.1 Functionality Testing
- [ ] All features work on Android and iOS
- [ ] App handles offline scenarios
- [ ] Navigation works smoothly
- [ ] Images load correctly
- [ ] Payment processing works (test mode)
- [ ] User authentication functions properly
- [ ] Database syncing works reliably
- [ ] No console errors or warnings

### 6.2 Performance Testing
- [ ] App launch time < 3 seconds
- [ ] Screen transitions smooth (60fps)
- [ ] Memory usage < 200MB
- [ ] Battery drain acceptable
- [ ] Network requests optimized
- [ ] Images compressed properly

### 6.3 Security Checklist
- [ ] No hardcoded credentials
- [ ] API endpoints use HTTPS
- [ ] Authentication tokens secure
- [ ] User data encrypted
- [ ] OWASP compliance checked
- [ ] Third-party libraries reviewed

### 6.4 Compliance Checklist
- [ ] Privacy Policy accessible in-app
- [ ] Terms of Service accessible in-app
- [ ] GDPR/POPIA compliance (South Africa data protection)
- [ ] Age restrictions proper (4+ rating)
- [ ] No misleading claims
- [ ] Accurate feature descriptions

---

## Phase 7: Submission Process

### 7.1 Google Play Store Submission
1. Create Google Play Developer Account ($25 one-time)
2. Create app listing
3. Upload AAB file (v1.0.0)
4. Fill app metadata
5. Select content rating
6. Add privacy policy
7. Submit for review (48-72 hours)

### 7.2 Apple App Store Submission
1. Create app record in App Store Connect
2. Fill app information
3. Set pricing tier (Free)
4. Add screenshots
5. Set review information
6. Complete IDFA declaration
7. Upload build from Xcode
8. Submit for review (48 hours - 1 week)

---

## Phase 8: Version Management

### 8.1 Version Numbering (semantic)
- **Format**: MAJOR.MINOR.PATCH
- **Example**: v1.0.0 → v1.1.0 (new features) → v1.1.1 (bug fixes)
- Update in `package.json` and platform configs

### 8.2 Changelog Format
```
Version 1.0.0 (2026-06-17)
✨ NEW FEATURES
- Initial app store launch
- Business profile management
- Event management system
- Real-time analytics

🐛 BUG FIXES
- Fixed payment processing
- Improved app stability

⚡ PERFORMANCE
- Faster loading times
- Optimized memory usage
```

---

## Phase 9: Post-Launch Monitoring

### 9.1 Analytics Setup
- Install Firebase Analytics
- Track user engagement
- Monitor crash reports
- Review user feedback

### 9.2 Support Infrastructure
- Support email: support@kasibusinesshub.com
- In-app support chat (consider adding)
- FAQ page
- Video tutorials

### 9.3 Update Strategy
- Plan regular updates (monthly)
- Monitor app store reviews
- Respond to user feedback
- Fix reported bugs promptly

---

## Quick Reference: URLs to Create/Verify

```
🌐 WEBSITE REQUIREMENTS:
- Homepage: https://kasibusinesshub.com
- Privacy Policy: https://kasibusinesshub.com/privacy
- Terms of Service: https://kasibusinesshub.com/terms
- Support: https://kasibusinesshub.com/support
- Contact: contact@kasibusinesshub.com

📱 APP IDENTIFIERS:
- Android Package: com.kasibusinesshub.app
- iOS Bundle ID: com.kasibusinesshub.app
- Version: 1.0.0 (build 1)

💳 PAYMENT SETUP (if needed):
- Stripe account for payments
- Google Play Billing (Android)
- StoreKit (iOS)
```

---

## Troubleshooting

### Common Issues:

**"App rejected for privacy policy"**
- Ensure privacy policy is complete and accessible
- Include data collection practices
- Provide contact information

**"Build fails on Android"**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**"iOS code signing errors"**
```bash
cd ios
pod deintegrate
pod install
```

**"App crashes on startup"**
- Check console for errors
- Verify permissions in manifest/plist
- Test on actual devices

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Setup Capacitor | 2-3 hours |
| Asset Creation | 1-2 days |
| Testing | 3-5 days |
| Google Play submission | 1 day (+ 2-3 days review) |
| Apple App Store submission | 1 day (+ 3-7 days review) |
| **TOTAL** | **7-14 days** |

---

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Connect](https://appstoreconnect.apple.com)
- [Android Developers](https://developer.android.com)
- [Apple Developer](https://developer.apple.com)

---

**Next Steps:**
1. Set up Capacitor when network is available
2. Generate required assets (icons, screenshots)
3. Create developer accounts (Google Play, Apple)
4. Follow the phase-by-phase guide
5. Launch and monitor!

Good luck with your app store launch! 🚀
