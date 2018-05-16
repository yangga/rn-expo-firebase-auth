# rn-expo-firebase-auth

Installation
------------
```
npm i -S rn-expo-firebase-auth
```

Configure
---------
It needs to set config variables into app.json

```json
"extra": {
  "facebook": {
    "appId": "..."
  },
  "google": {
    "androidClientId": "...",
    "androidStandaloneAppClientId": "...",
    "iosClientId": "...",
    "iosStandaloneAppClientId": "...",
    "webClientId": "..."
  }
},
```
References
* https://docs.expo.io/versions/v27.0.0/sdk/facebook
* https://docs.expo.io/versions/v27.0.0/sdk/google



Usage
---------
```javascript
import RN_Expo_Firebgase_Auth from 'rn-expo-firebase-auth'

const auth = new RN_Expo_Firebgase_Auth()

// initialize module
await auth.initAsync()

// facebook login
auth.loginWithFacebook()
    .then(result => console.log('result', result))
    .catch(e => console.error(e))

// google login
auth.loginWithGoogle()
    .then(result => console.log('result', result))
    .catch(e => console.error(e))

// email sign-up. (just creating account)
auth.createWithEmailAndPassword('your email', 'your password')
    .then(result => console.log('result', result))
    .catch(e => console.error(e))

// email sign-in. (with created above)
auth.loginWithEmailAndPassword('your email', 'your password')
    .then(result => console.log('result', result))
    .catch(e => console.error(e))

// getting auth info
const authInfo = auth.getAuthInfo()
console.log('authInfo', authInfo)

// log out
await auth.logout()

// send reset password email. you can edit mail templates in firebase console (auth menu)
await auth.sendPasswordResetEmail()

```

More
---------

After sign in/up, you can verify an 'idToken' if you have back-end server. All *login* methods return 'idToken' value.
More infos are below
- https://firebase.google.com/docs/auth/admin/verify-id-tokens
- https://www.npmjs.com/package/firebase-auth-node

Donations
---------
- Bitcoin - `3FpD2rxMKbRMxgy92XUKrLVTAsTWAVP5zY`
- Ethereum - `0x9957406df18f7b0ff0dd48f75197dddc92603421`
- Tron - `0x3b3fcc4ff00bacc2c85452492d5b7de29363bf67`
- Bitcoin Cash - `3H2C6TVBZXGsWK44MsPT9YVKzzdEtLndim`
- Eos - `0x3b3fcc4ff00bacc2c85452492d5b7de29363bf67`
- Neo - `AX4P3uAeS957wY4Kv4yHMgTwUvSamcKPp8`
- Ripple - `rN9qNpgnBaZwqCg8CvUZRPqCcPPY7wfWep`
