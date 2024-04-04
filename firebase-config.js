import admin from 'firebase-admin'

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_SDK_JSON_BASE64, 'base64').toString('ascii'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'ecoplaceapiimages.appspot.com'
})

const bucket = admin.storage().bucket()
export { bucket }