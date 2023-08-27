'use client'
import { useGqlClient } from '@/hooks/UseGqlClient';
import { useQuery } from 'graphql-hooks';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatBody from './ChatBody';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { db } from '@/firebase/fireabase.config';
import { currentUser } from '@/firebase/oauth.config';
import Loading from '@/app/loading';
import Error from '@/components/Error';



const GET_MODULE_TICKETS = `
query ModuleTickets($where: ModuleTicketWhere, $options: ModuleTicketOptions) {
  moduleTickets(where: $where, options: $options) {
    ticket
    forModule {
      title
    }
  }
}
`

// component
const Main = () => {
  //states
  const [currentModule, setCurrentModule] = React.useState<any>('');
  const [messages, setMessages] = React.useState<any>([]);



  //hooks 
  const client = useGqlClient();
  const user = currentUser();


  // fetching data
  const { data, loading, error } = useQuery(GET_MODULE_TICKETS, {
    client,
    variables: {
      where: {
        vendorHas: {
          userIs: {
            email: user?.email || 'no email'
          }
        }
      },
      options: {
        sort: [
          {
            createdAt: "DESC"
          }
        ]
      }

    }
  });


  console.log(messages)



  // setting  the latest module as current module
  useEffect(() => {
    if (data?.moduleTickets) {
      setCurrentModule(data?.moduleTickets[0]?.ticket)
    }

  }, [data?.moduleTickets]);


  // getting data based on current module
  useEffect(() => {

    if (currentModule) {
      getData()
    }
  }, [currentModule]);





  // creating chat in firebase if not exist
  const getData = async () => {
    const docRef = doc(db, "chats", currentModule.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const unsubscribe = onSnapshot(doc(db, "chats", currentModule.id), (doc) => {

        if (doc.exists()) {
          setMessages(doc.data().messages)
        }

        return () => unsubscribe();
      });
    } else {
      await setDoc(doc(db, "chats", currentModule.id), { messages: [] });
    }

  }








  if (loading) return <Loading />;

  if (error) return <Error />

  return (
    <>
      <Sidebar data={data?.moduleTickets} setCurrentModule={setCurrentModule} />
      <ChatBody messages={messages} currentModule={currentModule} />

    </>
  );
};

export default Main;