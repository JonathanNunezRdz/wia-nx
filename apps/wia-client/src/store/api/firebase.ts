// Import the functions you need from the SDKs you need
// import { getAnalytics } from 'firebase/analytics';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
	apiKey: 'AIzaSyBFMLhR0hTx_Giwkzy6n30mCKiLO2vbArc',
	authDomain: 'wia-web-app.firebaseapp.com',
	databaseURL: 'https://wia-web-app.firebaseio.com',
	projectId: 'wia-web-app',
	storageBucket: 'wia-web-app.appspot.com',
	messagingSenderId: '1026315011201',
	appId: '1:1026315011201:web:f63f5fe62a834f7682b980',
	measurementId: 'G-8LN6F5DYLM',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const storage = getStorage(app);
