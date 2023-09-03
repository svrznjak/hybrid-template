import { CapacitorConfig } from '@capacitor/cli'
import __APP_CONFIG__ from './src/app/config.json'

const config: CapacitorConfig = {
  appId: __APP_CONFIG__.APP_ID,
  appName: __APP_CONFIG__.APP_NAME,
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}

export default config
