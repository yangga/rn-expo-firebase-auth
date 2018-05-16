import { Constants } from 'expo'
import firebase from 'react-native-firebase'
import localStorage from 'react-native-sync-localstorage'

import Email from './modules/email'
import FB from './modules/facebook'
import Google from './modules/google'

class Auth
{
    constructor() {
        const { manifest } = Constants;

        this.modules = {
            email: new Email(),
            facebook: new FB(manifest.facebookAppId),
            google: new Google(manifest.extra.google)
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (__DEV__) console.log('onAuthStateChanged', user)            
        })

        firebase.auth().onUserChanged((user) => {
            if (__DEV__) console.log('onUserChanged', user)            
        })

        firebase.auth().onIdTokenChanged((user) => {
            if (__DEV__) console.log('onIdTokenChanged', user)
        })        
    }

    getModule(type) {
        return this.modules[type]
    }

    async initAsync() {
        this._reloadStoredAuthInfo()
    }

    _reloadStoredAuthInfo() {
        this.authInfo = localStorage.getItem('auth.info')
    }

    /*
    * 전에 로그인 한 정보를 얻어온다
    */
    hasStoredLoginInfo() {
        if (this.authInfo)
            return true

        return false
    }

    getAuthInfo() {
        return this.authInfo
    }

    /*
    * 로그 아웃
    */
    async logout() {
        await firebase.auth().signOut()
        localStorage.removeItem('auth.info')
    }

    /*
    * 전에 로그인 한 방식으로 로그인 시도한다
    * Access Token 이 expire 된 경우 사용된다
    */
    async loginWithStoredType() {
        return this.loginWithAuthInfo(this.authInfo.type, this.authInfo)
    }

    async loginWithFacebook() {
        return this.loginWithDispatcher(this.modules.facebook.getType(), async () => {
            return this.modules.facebook.login()
        })
    }

    async loginWithGoogle() {
        return this.loginWithDispatcher(this.modules.google.getType(), async () => {
            return this.modules.google.login()
        })
    }

    async loginWithEmailAndPassword(email, password) {
        return this.loginWithDispatcher(this.modules.email.getType(), async () => {
            return this.modules.email.login(email, password)
        })
    }

    async createWithEmailAndPassword(email, password) {
        return this.loginWithDispatcher(this.modules.email.getType(), async () => {
            return this.modules.email.signup(email, password)
        })
    }

    async loginWithDispatcher(type, dispather){
        const res = await dispather()
        if (__DEV__){
            console.log('login result -', res)
        }

        if (!res.user) throw new Error('invalid result')

        const idToken = await res.user.getIdToken()

        this._storeLoginInfo(Object.assign({}, {type}, res))
        return {
            idToken,
            user: res.user
        }
    }

    async loginWithAuthInfo(type, authInfo){
        if (!type || !authInfo)
            throw new Error('invalid login info')

        if (__DEV__){
            console.log('login data', type, authInfo)
        }

        try {
            for (const key in this.modules){
                const m = this.modules[key]
                if (m.getType() === type){
                    const res = await m.loginWithCache(authInfo)

                    if (__DEV__){
                        console.log('login result -', res)
                    }

                    if (!res.user) throw new Error('invalid result')

                    const idToken = await res.user.getIdToken()

                    this._storeLoginInfo(Object.assign({}, {type}, res))
                    return {
                        idToken,
                        user: res.user
                    }
                }
            }

            throw new Error('invalid type')
        }
        catch(e) {
            if (__DEV__){
                console.error(e)
            }
            else {
                console.log(e)
            }
            
            throw e
        }
    }

    async sendPasswordResetEmail(email){
        return this.modules.email.sendPasswordResetEmail(email)
    }

    _storeLoginInfo(info) {
        if (__DEV__){
            console.log('storeLoginInfo', info)
        }        

        const expirationTime = info.expirationTime

        const authInfo = Object.assign({}, info, {
            expirationTime: expirationTime ? Math.floor(expirationTime > 1000000000000 ? expirationTime/1000 : expirationTime) : 0,
        })

        localStorage.setItem('auth.info', authInfo)
        this.authInfo = authInfo
    }
}

export default Auth
