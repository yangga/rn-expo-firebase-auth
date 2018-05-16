import Expo from 'expo';
import firebase from 'react-native-firebase'
import FirebaseAuth from './firebaseAuth'

export default class FaceBook extends FirebaseAuth {
  constructor(appId, initParam={}) {
    super()
    this.appId = appId
    this.initParam = initParam
  }

  getType() {
    return 'facebook'
  }

  async login() {
      if (__DEV__){
          console.log('try login facebook with param', this.appId, this.initParam)
      }
      
      const data = await Expo.Facebook.logInWithReadPermissionsAsync(this.appId, 
        Object.assign({}, this.initParam, {
          permissions: ['public_profile']
        })
      )

      if (__DEV__){
        console.log('FB Auth data', data)
      }

      return this.loginWithCache({
        accessToken: data.token,
        expirationTime: data.expires,
      })
  }

  async loginWithCache({
    accessToken,
    expirationTime
  }) {
    if (!accessToken) throw Error('invalid accessToken')

    const credential = firebase.auth.FacebookAuthProvider.credential(accessToken)
    const {
      user
    } = await this.procCredential(credential)

    return {
      accessToken,
      expirationTime,
      user
    }
  }
}
