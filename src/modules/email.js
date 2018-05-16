import firebase from 'react-native-firebase'
import FirebaseAuth from './firebaseAuth'

export default class Email extends FirebaseAuth {
  constructor() {
    super()
  }

  getType() {
    return 'email'
  }

  async signup(email, password) {
    if (__DEV__){
        console.log('try signin email with param', email, password)
    }

    const userCredential = await firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)

    const accessToken = this.encodeLoginInfo({
      email, 
      password
    })

    return {
      accessToken,
      user: userCredential.user
    }
  }

  async login(email, password) {
    if (__DEV__){
        console.log('try login email with param', email, password)
    }
      
    const userCredential = await firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)

    const accessToken = this.encodeLoginInfo({
      email, 
      password
    })

    return {
      accessToken,
      user: userCredential.user
    }
  }

  async loginWithCache({        
    accessToken,
  }) {
    if (!accessToken) throw Error('invalid accessToken')
    
    const {
      email,
      password
    } = this.decodeLoginInfo(accessToken)

    return this.login(email, password)
  }

  async sendPasswordResetEmail(email) {
    return firebase.auth().sendPasswordResetEmail(email)
  }

}
