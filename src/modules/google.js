import Expo from 'expo';
import firebase from 'react-native-firebase'
import FirebaseAuth from './firebaseAuth'

export default class Google extends FirebaseAuth {
    constructor(initParam) {
        super()
        this.initParam = initParam
    }

    getType() {
        return 'google'
    }

    async login() {
        if (__DEV__){
            console.log('try login google with param', this.initParam)
        }

        const {
            accessToken,
            idToken,
        } = await Expo.Google.logInAsync(Object.assign({}, this.initParam, {
            scopes: ['profile', 'email']
        }))

        if (__DEV__){
            console.log('Google Auth data', {
                accessToken,
                idToken,
            })
        }

        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)

        const {
            user
        } = await this.procCredential(credential)

        return {
            accessToken,
            user,
        }

        return this.loginWithCache()
    }

    async loginWithCache() {
        return this.login()        
    }
}
