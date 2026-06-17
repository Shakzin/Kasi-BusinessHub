import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kasibusinesshub.app',
  appName: 'Kasi BusinessHub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: undefined,
    cleartext: true,
  },
  ios: {
    scheme: 'App',
    contentInset: 'automatic',
    scrollBounce: true,
    limitsNavigationsToAppBoundDomains: true,
    allowsInlineMediaPlayback: true,
  },
  android: {
    buildOptions: {
      keystorePath: 'kasi-businesshub-release.keystore',
      keystoreAlias: 'kasi-businesshub-key',
    },
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      backgroundColor: '#FAFAF8',
      showSpinner: true,
      spinnerColor: '#4F46E5',
    },
    App: {
      allowedSchemes: ['http', 'https'],
    },
  },
};

export default config;
