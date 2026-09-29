import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.moyplan.planner',
  appName: 'Мой план',
  webDir: 'dist/client',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'automatic',
  },
};

export default config;
