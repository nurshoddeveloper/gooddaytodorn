
const API_URL = 'https://fcm.googleapis.com/fcm/send';

// https://console.firebase.google.com/project/coral-ring-165223/settings/cloudmessaging/android:work.goodday.m.app
// app -> settings -> cloud messaging - Project credentials
// Server key
const API_KEY = 'AAAAiRiij2o:APA91bHxLzVRax0ynGzGlPV0RIW_R4Qfy8xtJiUi1q-2XAo4X_txYZL6BdaKxjBga7MJ1ejwignPFTwgewh_efJO9dH5T3fH0TTy1FcuKNZbzZ5NYfgv9i2kh5XpunHPOFC_izg8aMmU';
// Legacy server key
//const API_KEY = 'AIzaSyDmmS9r_CnDhQh8xLqOekgPlNCl03mCE9c';

class FcmClient {

    async send(body, type) {
        if (API_KEY === 'YOUR_API_KEY') {
            console.log('FcmClient', 'Set your API_KEY in firebase-client.js');
            return;
        }
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'key=' + API_KEY
        });

        try {
            let response = await fetch(API_URL, { method: 'POST', headers, body });
            console.log('FcmClient', 'response', response);
            try{
                response = await response.json();
                if(!response.success) {
                    console.log('FcmClient', 'Failed to send notification, check error log')
                }
            } catch (err) {
                console.log('FcmClient', 'Failed to send notification, check error log')
            }
        } catch (err) {
            console.log('FcmClient catch', err && err.message)
        }
    }

}

const fcmClient = new FcmClient();
export default fcmClient;
