import __APP_CONFIG__ from '#/config.json' assert { type: 'json' }

export default {
  apiKey: __APP_CONFIG__.FIREBASE_CONFIG.apiKey,
  authDomain: __APP_CONFIG__.FIREBASE_CONFIG.authDomain,
  databaseURL: __APP_CONFIG__.FIREBASE_CONFIG.databaseURL,
  projectId: __APP_CONFIG__.FIREBASE_CONFIG.projectId,
  storageBucket: __APP_CONFIG__.FIREBASE_CONFIG.storageBucket,
  messagingSenderId: __APP_CONFIG__.FIREBASE_CONFIG.messagingSenderId,
  appId: __APP_CONFIG__.FIREBASE_CONFIG.appId,
  measurementId: __APP_CONFIG__.FIREBASE_CONFIG.measurementId
}
