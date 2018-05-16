import assert from 'assert'
import firebase from 'react-native-firebase'
import base64 from 'base-64'

export default class FirebaseAuth {
    getType() {
        assert(0, 'shouldn\'t call here')
    }

    async procCredential(credential){
        if (!credential) {
            throw Error('failed to credential')
        }
        
        // login with credential
        const userCredential = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        if (__DEV__){
            console.log('firebase.auth().signInAndRetrieveDataWithCredential', userCredential)
        }

        return {
            userCredential,
            user: userCredential.user
        }
    }

    encodeLoginInfo(obj) {
        return base64.encode(JSON.stringify(obj))
    }
    
    decodeLoginInfo(encObj) {
        return JSON.parse(base64.decode(encObj))
    }
}
