import { View, Text } from "react-native";
import React from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { Firestore } from "firebase/firestore";

const NuevoMensaje = ( navigation ) => {
    const [messages, setMessages] = useState([])
    const router = useRoute

    useEffect(() => {
        setMessages([
        {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
            },
        },
        ])
    }, [])

    const onSend = messagesArray => {
        console.log( messagesArray );
        const msg = mesaggesArray[0];
        const myMsg = {...msg,
            senderId: route.params.data.myId,
            receiverId: route.params.data.userId}
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, myMsg),
        )
        firestore().colletion("Chats").doc(route.params.data.myId).
        colletion("messages").add({ ...myMsg, createdAt: new Date() })
    }


    return(
        <View style = {{ flex:1 }}>
            <GiftedChat messages={messages}
                onSend={messages => onSend(messages)}
                user={{ _id:  route.params.data.myId }}/>

        </View>
    )

}

export default NuevoMensaje;