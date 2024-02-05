export default async function firebaseConfig() {
  const __APP_CONFIG__ = await import('#/config.json');
  return {
    apiKey: __APP_CONFIG__.FIREBASE_CONFIG.apiKey,
    authDomain: __APP_CONFIG__.FIREBASE_CONFIG.authDomain,
    // databaseURL: __APP_CONFIG__.FIREBASE_CONFIG.databaseURL,
    projectId: __APP_CONFIG__.FIREBASE_CONFIG.projectId,
    storageBucket: __APP_CONFIG__.FIREBASE_CONFIG.storageBucket,
    messagingSenderId: __APP_CONFIG__.FIREBASE_CONFIG.messagingSenderId,
    appId: __APP_CONFIG__.FIREBASE_CONFIG.appId
    //  measurementId: __APP_CONFIG__.FIREBASE_CONFIG.measurementId
  };
}
