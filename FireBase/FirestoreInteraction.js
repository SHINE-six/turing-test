import { useState, useContext, useEffect } from "react";
import { db, auth } from './FirebaseConfig';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { UserContext } from '../Context/UserContext';
import { doc, collection, addDoc, getDocs, updateDoc, increment, deleteDoc } from "firebase/firestore";

export const useFirestoreInteraction = () => {
    const { user, setUser } = useContext(UserContext);
    const [location, setLocation] = useState(null);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    // console.error(`Error getting location: ${error.message}`);
                    setLocation(null);
                }
            );
        } else {
            // console.error('Geolocation is not supported by this browser.');
            setLocation(null);
        }
    },[]);

    const handleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                setUser(user);
                
                readUserDb(user);
                // addToOnlineUsers(user);
            }).catch((error) => {
                console.log(error);
            });
    }

    const readUserDb = async (user) => {
        try {
            const docRef = collection(db, "Users");
            const querySnapshot = await getDocs(docRef);
            let userExists = false;
            console.log(user);
            querySnapshot.forEach(async (check_doc) => {
                if (check_doc.data().uid === user.uid) {
                    userExists = true;
                    console.log("User already exists");
                    
                    const docRef = doc(db, "Users", check_doc.id);
                    await updateDoc(docRef, {
                        visitCount: increment(1)
                    });
                    console.log("Document updated successfully");
                }
            });
            if (!userExists) {
                console.log("User does not exist");
                addToUserDb(user);
            }
        }
        catch (e) {
            console.error("Error reading document: ", e);
        }
    }

    const addToUserDb = (user) => {
        try {
            const docRef = addDoc(collection(db, "Users"), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                location: location,
                visitCount: 1
            });
            console.log("Document written with ID: ", docRef.id);
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const addToOnlineUsers = (user) => {
        try {
            const docRef = addDoc(collection(db, "OnlineUsers"), {
                uid: user.uid,
                name: user.displayName,
                isAvailable: true
            });
            thisDocRef.current = docRef;
            console.log("Document written with ID: ", docRef.id);
        }
        catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const handleSignOut = () => {
        auth.signOut().then(() => {
            // deleteFromOnlineUsers();
            setUser(null);
            console.log("Sign out successful");
        }).catch((error) => {
            console.log(error);
        });
    }

    const deleteFromOnlineUsers = async () => {
        try {
            const docRef = collection(db, "OnlineUsers");
            const querySnapshot = await getDocs(docRef);
            console.log(user);
            querySnapshot.forEach(async (check_doc) => {
                if (check_doc.data().uid === user.uid) {
                    console.log("Found user");
                    
                    const docRef = doc(db, "OnlineUsers", check_doc.id);
                    await deleteDoc(docRef);
                    console.log("Document deleted successfully");
                }
            });
        }
        catch (e) {
            console.error("Error reading document: ", e);
        }
    }
    
    return { handleSignIn, handleSignOut };
}
