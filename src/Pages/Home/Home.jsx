import React, { useState, useContext, useEffect } from "react";
import { UserContext, ConversationContext } from "../../../Context/UserContext";
import { db } from "../../../FireBase/FirebaseConfig";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useConversationPairing } from "../../../FireBase/Conversation_Pairing";


const Home = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useContext(UserContext);
    const { conversation } = useContext(ConversationContext);
    const { checkForAvailableConversation } = useConversationPairing();



    const sendMessage = async () => {
        console.log(conversation);
        try {
            const docRef = doc(db, "Conversations", conversation);
            console.log(docRef);
            await updateDoc(docRef, {
                messages: arrayUnion({
                    sender: user.displayName,
                    content: newMessage,
                }),
            });
            console.log("Document written with ID: ", docRef.id);
            getMessages();
            setNewMessage("");
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMessages();
    });

    const getMessages = async () => {
        try {
            const docRef = doc(db, "Conversations", conversation);
            const querySnapshot = await getDoc(docRef);
            if(querySnapshot.exists()){
                setMessages(querySnapshot.data().messages);
            }
            else {
                console.log("No such document!");
            }
        }
        catch (error) {
            console.log(error);
        }
    };

  return (
    <div>
      {/* Render messages */}
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender}:</strong> {message.content}
        </div>
      ))}

      {/* Input for new messages */}
    <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
    />
    <button onClick={sendMessage} className="p-4 border-4 bg-blue-300">Send</button>

    <button onClick={checkForAvailableConversation} className="p-4 border-4 bg-red-300">Start</button>
    </div>
  );
};

export default Home;
