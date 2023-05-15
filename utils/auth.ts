import React, {useState, useEffect, useContext, createContext} from 'react';
import queryString from 'query-string';
import * as firebase from 'firebase/app';
import 'firebase/auth';

//import prod from '../.firebase/prod.json';

if (!firebase.apps.length) {
    firebase.initializeApp({
    // prod
  	apiKey: "AIzaSyAhK3nPSY6MqyLM3wQXWsCfeC_CNUmZzN8",//"process.env.firebase_config_api_key",
  	authDomain: "daydrink-54235.firebaseapp.com",//"process.env.firebase_authDomain",
  	projectId: "daydrink-54235",//"process.env.firebase_projectId",
  	storageBucket: "daydrink-54235.appspot.com",//"process.env.firebase_storageBucket",
  	messagingSenderId: "945874342589", //"process.env.firebase_messagingSenderId,
  	appId: "1:945874342589:web:30f05799903838dce59dd4",//"process.env.firebase_appId",
  	measurementId: "G-4ZCHG67Q6M",//"process.env.firebase_measurementid",
    });
}

const authContext = createContext();

export function ProvideAuth({children}) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
};

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = (email, password) => {
        return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                setUser(response.user);
                return response.user;
            });
    };

    const signup = (email, password) => {
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                setUser(response.user);
                return response.user;
            });
    };

    const signout = () => {
        return firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(false);
            });
    };

    const sendPasswordResetEmail = (email) => {
        return firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                return true;
            });
    };

    const confirmPasswordReset = (password, code) => {
        const resetCode = code || getFromQueryString('oobCode');

        return firebase
            .auth()
            .confirmPasswordReset(resetCode, password)
            .then(() => {
                return true;
            });
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        userId: user && user.uid,
        signin,
        signup,
        signout,
        sendPasswordResetEmail,
        confirmPasswordReset
    };
}

const getFromQueryString = (key) => {
    return queryString.parse(window.location.search)[key];
};
