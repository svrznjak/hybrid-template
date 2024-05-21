# Hybrid template

This is a TypeScript template for building quality multiplatform apps. It uses the following technologies:

- [Vue 3](https://v3.vuejs.org/)
- - [Vue I18n](https:https://vue-i18n.intlify.dev/) - Internationalization (translations, date/time formatting, number formatting)
- - [VeeValidate](https://vee-validate.logaretm.com/v4/) - Form validation
- [Framework7](https://framework7.io/) - UI, Routing
- [Firebase](https://firebase.google.com/) - Authentication, Database, Storage, Analytics. Firebase firestore is used as a direct (realtime) datastore (replaces pinia / vue).
- [Capacitor](https://capacitorjs.com/) - Native API access, Build, Deploy

## Why this template?

The purpose of this template is to serve as a starting point for building quality multiplatform apps. It handles all the time-consuming tasks like setting up routing, authentication, database access, storage access, analytics, internationalization, form validation, app subscriptions, capacitor settings etc. This way you can focus on the actual app logic and UI.

## Features

- Multiplatform (iOS, Android, Web, PWA, Electron)
- Internationalization (translations, date/time formatting, number formatting)
- Form validation
- Authentication (anonymous, email/password, Google, Facebook, Apple)
- Firestore database
- Firebase Storage
- Firebase Analytics
- App subscriptions (Apple, Google, Stripe) - RevenueCat Subscription tracking
- Push notifications
- Offline support
- Prebuild pages (login, signup, confirm email, forgot password, profile, settings, home, subscribe )

## Getting started

- Fork/Clone this repository
- Edit `src/app/config.json` with your Firebase config
- Install dependencies: `npm install`
- Create a new Firebase project: https://console.firebase.google.com/
- Create a new Firestore database
- Add a new web app to your Firebase project
- Enter your Firebase config into `src/app/config.json`

### iOS

- add iOS app to Firebase
- download GoogleService-Info.plist and place it in ios/App/App

### Android

- add Android app to Firebase
- download google-services.json and place it in Android/app

## Files and folders you work with

- `src/app` - App logic and UI

## Running the app

- ---- todo

- NOTES:

* vue-i18n@next is installed, because it supports TS5 -- TODO: check if this is still needed
