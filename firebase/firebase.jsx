
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGgyIAx23x20Egy8A58yAwViZ0GC30gy4",
    authDomain: "metele-stickerss.firebaseapp.com",
    projectId: "metele-stickerss",
    storageBucket: "metele-stickerss.firebasestorage.app",
    messagingSenderId: "937953849779",
    appId: "1:937953849779:web:97ef1cd048629106999bc6"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


