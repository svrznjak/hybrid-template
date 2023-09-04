import { MobileProject, MobileProjectConfig } from '@trapezedev/project'
import __APP_CONFIG__ from './src/app/config.json' assert { type: 'json' }

const config: MobileProjectConfig = {
  ios: {
    path: 'ios/App'
  },
  android: {
    path: 'android'
  }
}

const project = new MobileProject('./', config)

await project.load()

// ## Set values iOS
const iosAppTarget = project.ios?.getAppTarget()

if (project.ios && iosAppTarget) {
  console.log('Configuring iOS')
  // app name, package name, version, build number
  project.ios.setDisplayName(iosAppTarget.name, null, __APP_CONFIG__.APP_NAME)
  project.ios.setBundleId(iosAppTarget.name, null, __APP_CONFIG__.APP_ID)
  await project.ios.setVersion(iosAppTarget.name, null, __APP_CONFIG__.VERSION)
  await project.ios.setBuild(iosAppTarget.name, null, __APP_CONFIG__.BUILD_NUMBER)
}

// ## Set values android
if (project.android) {
  // app name, package name, version, build number
  project.android.setAppName(__APP_CONFIG__.APP_NAME)
  await project.android.setPackageName(__APP_CONFIG__.APP_ID)
  await project.android.setVersionName(__APP_CONFIG__.VERSION)
  await project.android.setVersionCode(__APP_CONFIG__.BUILD_NUMBER)

  // set strings.xml
  const stringsFile = project.android.getResourceXmlFile('values/strings.xml')
  if (!stringsFile) throw new Error('android/app/src/main/res/values/strings.xml not found')
  stringsFile.replaceFragment(
    `resources/string[@name="title_activity_main"]`,
    `<string name="title_activity_main">${__APP_CONFIG__.APP_NAME}</string>`
  )
  stringsFile.replaceFragment(
    `resources/string[@name="package_name"]`,
    `<string name="package_name">${__APP_CONFIG__.APP_ID}</string>`
  )
  stringsFile.replaceFragment(
    `resources/string[@name="custom_url_scheme"]`,
    `<string name="custom_url_scheme">${__APP_CONFIG__.APP_ID}</string>`
  )
}
// ## Commit changes
await project.commit()

import { execSync } from 'child_process'
execSync(
  `npx @capacitor/assets generate --assetPath './src/app/assets/appIcons' --iconBackgroundColor '${
    __APP_CONFIG__.ICON_AND_SPLASH.backgroundColor || '#eeeeee'
  }' --iconBackgroundColorDark '${
    __APP_CONFIG__.ICON_AND_SPLASH.backgroundColorDark || '#222222'
  }' --splashBackgroundColor '${
    __APP_CONFIG__.ICON_AND_SPLASH.splashBackgroundColor || '#eeeeee'
  }' --splashBackgroundColorDark '${
    __APP_CONFIG__.ICON_AND_SPLASH.splashBackgroundColorDark || '#111111'
  }' --logoSplashScale '${__APP_CONFIG__.ICON_AND_SPLASH.logoSplashScale || '0.2'}'`
)
