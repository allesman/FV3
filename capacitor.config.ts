import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.allesman.fv3',
	appName: 'Earlybird',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	},
  bundledWebRuntime: false
};

export default config;
