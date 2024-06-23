import admin from 'firebase-admin';

const firebaseConfig = {
    apiKey: "AIzaSyCaiqjDi8JcQrJkUqX-7ceknAMOCXEuaF0",
    authDomain: "investment-app-4cd4b.firebaseapp.com",
    projectId: "investment-app-4cd4b",
    storageBucket: "investment-app-4cd4b.appspot.com",
    messagingSenderId: "694235295002",
    appId: "1:694235295002:web:54f03dcfef1d96b5a750a3",
    measurementId: "G-4HFFDT709E"
};

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    ...firebaseConfig,
});

export default admin;