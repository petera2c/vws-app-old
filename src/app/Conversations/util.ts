import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  get,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
} from "@firebase/database";
import { db, db2 } from "../../config/db_init";

import { message } from "antd";

import {
  getEndAtValueTimestamp,
  getEndAtValueTimestampFirst,
} from "../../util";
import MessageType from "@/types/MessageType";
import ConversationType from "@/types/ConversationType";
import { useSearchParams } from "next/navigation";

export const conversationListener = (
  currentConversation: any,
  setConversations: any
) => {
  const unsubscribe = onSnapshot(
    doc(db, "conversations", currentConversation.id),
    (doc) => {
      const updatedConversation: any = { id: doc.id, ...doc.data() };

      setConversations((oldConversations: any) => {
        const indexOfUpdatedConversation = oldConversations.findIndex(
          (conversation: any) => conversation.id === updatedConversation.id
        );

        for (let index in updatedConversation) {
          if (!oldConversations[indexOfUpdatedConversation]) continue;
          oldConversations[indexOfUpdatedConversation][index] =
            updatedConversation[index];
        }

        oldConversations.sort((a: any, b: any) =>
          a.last_updated < b.last_updated ? 1 : -1
        );

        return [...oldConversations];
      });
    }
  );

  return unsubscribe;
};

export const deleteConversation = async (
  conversationID: any,
  navigate: any,
  setActiveConversation: any,
  setConversations: any,
  userID: any
) => {
  setConversations((oldConversations: any) => {
    const deleteIndex = oldConversations.findIndex(
      (conversation: any) => conversation.id === conversationID
    );
    oldConversations.splice(deleteIndex, 1);
    return [...oldConversations];
  });

  await updateDoc(doc(db, "conversations", conversationID), {
    [userID]: deleteField(),
    members: arrayRemove(userID),
  });

  setActiveConversation(false);
  navigate("/chat");

  message.success("Success :)!");
};

export const deleteMessage = async (
  conversationID: string,
  messageID: string,
  setMessages: any
) => {
  await deleteDoc(
    doc(db, "conversation_extra_data", conversationID, "messages", messageID)
  );

  setMessages((messages: any) => {
    messages.splice(
      messages.findIndex((message: MessageType) => message.id === messageID),
      1
    );
    return [...messages];
  });
  message.success("Message deleted!");
};

export const getConversationPartnerUserID = (members: any, userID: string) => {
  if (members && members.length === 2)
    for (let index in members) {
      if (members[index] !== userID) return members[index];
    }
  return false;
};

export const getIsChatMuted = (
  conversationID: string,

  setIsMuted: any,
  userID: string
) => {
  get(ref(db2, "muted/" + conversationID + "/" + userID)).then((doc) => {
    setIsMuted(doc.val());
  });
};

export const isUserTypingListener = (
  conversationID: string,

  isUserTypingTimeout: any,
  partnerID: string,
  scrollToBottom: any,
  setNumberOfUsersTyping: any,
  setShowPartnerIsTyping: any,
  userID: string
) => {
  let dbRef;
  if (partnerID) {
    dbRef = ref(db2, "is_typing/" + conversationID + "/" + partnerID);

    onValue(dbRef, (snapshot) => {
      if (isTimestampWithinSeconds(snapshot.val())) {
        setShowPartnerIsTyping(true);
        setTimeout(scrollToBottom, 800);

        if (isUserTypingTimeout.current) {
          clearTimeout(isUserTypingTimeout.current);
        }
        isUserTypingTimeout.current = setTimeout(() => {
          setShowPartnerIsTyping(false);
        }, 3000);
      } else {
        setShowPartnerIsTyping(false);
      }
    });
  } else {
    dbRef = ref(db2, conversationID);

    onValue(dbRef, (snapshot) => {
      const test = snapshot.val();
      for (let index in test) {
        if (index === userID) continue;
        if (isTimestampWithinSeconds(test[index])) {
          setNumberOfUsersTyping((currentArray: any) => {
            if (
              currentArray.findIndex((userID: string) => userID === index) !==
              -1
            )
              return currentArray;
            else {
              currentArray.push(index);
              return [...currentArray];
            }
          });
          setTimeout(scrollToBottom, 400);

          if (isUserTypingTimeout.current) {
            clearTimeout(isUserTypingTimeout.current);
          }
          isUserTypingTimeout.current = setTimeout(() => {
            setNumberOfUsersTyping((currentArray: any) => {
              currentArray.splice(
                currentArray.findIndex((userID: string) => userID === index),
                1
              );
              return [...currentArray];
            });
          }, 3000);
        }
      }
    });
  }

  return dbRef;
};

export const isTimestampWithinSeconds = (timestamp: number) => {
  return Timestamp.now().toMillis() - timestamp < 4000;
};

export const messageListener = (
  conversationID: string,

  scrollToBottom: any,
  setMessages: any,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversation_extra_data", conversationID, "messages"),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          console.log(querySnapshot.docs[0].data().body);
          setMessages((oldMessages: MessageType[]) => [
            ...oldMessages,
            {
              id: querySnapshot.docs[0].id,
              ...querySnapshot.docs[0].data(),
              doc: querySnapshot.docs[0],
            },
          ]);
          setTimeout(() => {
            scrollToBottom();
          }, 200);
        }
      }
    }
  );

  return unsubscribe;
};

export const getConversations = async (
  conversations: any,

  setConversations: any,
  userID?: string
) => {
  const startAt = getEndAtValueTimestamp(conversations);

  const conversationsQuerySnapshot = await getDocs(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      orderBy("last_updated", "desc"),
      startAfter(startAt),
      limit(5)
    )
  );

  let newConversations: any = [];
  conversationsQuerySnapshot.docs.forEach((item, i) => {
    newConversations.push({
      id: item.id,
      ...item.data(),
      doc: conversationsQuerySnapshot.docs[i],
    });
  });

  setConversations(newConversations);
};

export const getMessages = async (
  conversationID: string,

  messages: any,
  scrollToBottom: any,
  setCanLoadMore: any,
  setMessages: any,
  first = true
) => {
  let startAt = getEndAtValueTimestampFirst(messages);
  if (first) startAt = getEndAtValueTimestampFirst([]);

  const snapshot = await getDocs(
    query(
      collection(db, "conversation_extra_data", conversationID, "messages"),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newMessages: any = [];
    snapshot.docs.forEach((doc) => {
      newMessages.unshift({ id: doc.id, doc, ...doc.data() });
    });

    if (newMessages.length < 10) setCanLoadMore(false);
    if (first) {
      setMessages(newMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } else {
      setMessages((oldMessages: any) => {
        if (oldMessages) return [...newMessages, ...oldMessages];
        else return newMessages;
      });
    }
  } else {
    setMessages([]);
    setCanLoadMore(false);
  }
};

export const mostRecentConversationListener = (
  setConversations: any,
  userID: string,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      where("last_updated", ">=", Timestamp.now().toMillis()),
      orderBy("last_updated", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      const conversationDoc = querySnapshot.docs[0];

      if (first) {
        first = false;
      } else if (conversationDoc) {
        setConversations((oldConversations: any) => {
          const isConversationAlreadyListening = oldConversations.some(
            (obj: any) => obj.id === conversationDoc.id
          );

          if (!isConversationAlreadyListening)
            return [
              ...oldConversations,
              {
                doc: conversationDoc,
                id: conversationDoc.id,
                ...conversationDoc.data(),
              },
            ];
          else return oldConversations;
        });
      }
    }
  );

  return unsubscribe;
};

export const muteChat = async (
  conversationID: string,
  userID: string,
  value: any
) => {
  set(ref(db2, "muted/" + conversationID + "/" + userID), value);
};

export const readConversation = async (
  conversation: ConversationType,
  userID: string
) => {
  await updateDoc(doc(db, "conversations", conversation.id), {
    [userID]: true,
    go_to_inbox: false,
  });
};

export const sendMessage = async (
  conversationID: string,
  message: string,
  userID: string
) => {
  await addDoc(
    collection(db, "conversation_extra_data", conversationID, "messages"),
    {
      body: message,
      server_timestamp: Timestamp.now().toMillis(),
      userID,
    }
  );
};

export const setConversationIsTyping = (
  conversationID: string,
  finishedTyping: any,
  userID: string
) => {
  if (conversationID && userID)
    update(ref(db2, "is_typing/" + conversationID), {
      [userID]: finishedTyping ? false : serverTimestamp(),
    });
};

export const setInitialConversationsAndActiveConversation = async (
  newConversations: any,
  openFirstChat: any,
  setActiveConversation: any,
  setCanLoadMore: any,
  setConversations: any
) => {
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  if (newConversations.length < 5) setCanLoadMore(false);

  if (search) {
    const foundConversation = newConversations.find(
      (conversation: ConversationType) =>
        conversation.id === search.substring(1)
    );

    if (foundConversation) setActiveConversation(foundConversation);
    else {
      try {
        const conversationDoc = await getDoc(
          doc(db, "conversations", search.substring(1))
        );

        if (conversationDoc.exists())
          setActiveConversation({
            id: conversationDoc.id,
            doc: conversationDoc,
            ...conversationDoc.data(),
          });
        else setActiveConversation(false);
      } catch (e) {
        console.log(e);
      }
    }
  } else if (openFirstChat && newConversations.length > 0) {
    setActiveConversation(newConversations[0]);
  } else setActiveConversation(false);

  setConversations(newConversations);
};
