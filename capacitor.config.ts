import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recaudo.com',
  appName: 'CREDISABE V2',
  webDir: 'dist/browser',
  server: {
    androidScheme: 'http',
    allowNavigation: ['*'],
    cleartext: true
  }
};

export default config;
