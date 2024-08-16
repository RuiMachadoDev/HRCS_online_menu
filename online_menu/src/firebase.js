import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLk_wcH40OKlV_5kPKrvDal5m8nBlX6Fg",
  authDomain: "hrcsonlinemenu.firebaseapp.com",
  projectId: "hrcsonlinemenu",
  storageBucket: "hrcsonlinemenu.appspot.com",
  messagingSenderId: "148845543687",
  appId: "1:148845543687:web:e0618fdd56906f177d45a2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
