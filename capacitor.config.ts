import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axiltree.app',
  appName: 'AxilTree',
  webDir: 'www',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://axiltree.com',
    cleartext: false
  }
};

export default config;
