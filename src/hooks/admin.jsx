import { useState, useEffect } from "react";
import { useSubmit, useLocation } from "react-router-dom";
import { getContacts, createContact } from "../contacts";


const SESSION_DURATION = (5*60);

export const useSessionTime = () => {
    const [remainingTime, setRemainingTime] = useState(SESSION_DURATION);
    let timer = 0;
    const submit = useSubmit();
    const location = useLocation();
  
    //Count Down
    useEffect(() => {
      timer = setInterval(
        () => {
          setRemainingTime(prevRemainingTime => {
            if (prevRemainingTime > 0) {
              return prevRemainingTime - 1;
            } else {
              clearInterval(timer);
              return 0;
            }
          });
        }, 1000);
        
      return ()=>{clearInterval(timer);} // Limpiar el intervalo al desmontar el componente
    }, []);

    //Time Out
    useEffect(() => {
      const timer = setTimeout(() => {
        submit(null, { method: "post", action: "/logout" });
      }, SESSION_DURATION*1000);
  
      return () => clearTimeout(timer);
    }, [submit, location]);
  
    return remainingTime;
};

export const useExampleContact = ()=>{
  const [firstTime, setFirstTime] = useState(true)
  if(firstTime===true){
    getContacts().then(
      (contactList)=>{
        setFirstTime(false);
        if(contactList.length===0){
          let contact = { 
            "id": "exampleId",
            "createdAt": 1696941836452,
            "first": "German",
            "last": "Levental",
            "twitter": "@germanlevental",
            "avatar": "https://media.licdn.com/dms/image/C4E03AQEYqNIBWkR25g/profile-displayphoto-shrink_200_200/0/1556768978154?e=1701302400&v=beta&t=LM8LtMFOf7XEpWBreLzg9M-zoQMmZ8OWQYNmS2caT24",
            "notes": "This is an example of contact!",
            "favorite": true
          };
          createContact(contact).then(()=>{
            useSubmit(null, {action: "/"});
          });
        }
      }
    )
  }
}