import { useContext } from 'react';
import { UserContext, ConversationContext } from '../Context/UserContext';
import { db, auth } from './FirebaseConfig';
import { doc, collection, addDoc, getDocs, updateDoc } from "firebase/firestore";


export const useConversationPairing = () => {
    const { user, setUser } = useContext(UserContext);
    const { setConversation } = useContext(ConversationContext);

    const checkForAvailableConversation= async () => {
        try {
            console.log("Checking for available conversation");
            const docRef = collection(db, "Conversations");
            const querySnapshot = await getDocs(docRef);
            let conversationExists = false;
            if (querySnapshot.empty) {
                console.log("No conversations found");
                const docRef = collection(db, "Conversations");
                console.log(user.uid);
                const docSnap = await addDoc(docRef, {
                    user1: user.uid,
                    user1Name: user.displayName,
                    user2: null,
                    user2Name: null,
                    messages: []
                });
                setConversation(docSnap.id);
                console.log("Conversation initiated with conversation id: ", docSnap.id);
            }
            querySnapshot.forEach(async (check_doc) => {
                if (check_doc.data().user2 === null) {
                    conversationExists = true;
                    console.log("Conversation found");

                    const docRef = doc(db, "Conversations", check_doc.id);
                    await updateDoc(docRef, {
                        user2: user.uid,
                        user2Name: user.displayName
                    });
                    setConversation(check_doc.id);
                    console.log("Conversation paired");
                }
                else if (check_doc.data().user2 !== null) {
                    console.log("No available conversation not found");

                    const docRef = collection(db, "Conversations");
                    const docSnap = await addDoc(docRef, {
                        user1: user.uid,
                        user1Name: user.displayName,
                        user2: null,
                        user2Name: null,
                        messages: []
                    });
                    setConversation(docSnap.id);
                    console.log("Conversation initiated with conversation id: ", docSnap.id);
                }
                else {
                    console.log("Error");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }


    return { checkForAvailableConversation };
}