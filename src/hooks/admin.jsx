import { useState, useEffect, useRef } from "react";
import { useSubmit, useLocation } from "react-router-dom";
import { getContacts, createContact } from "../contacts";


const SESSION_DURATION = (1000*5*60);

export const useSessionTime = () => {
    const [remainingTime, setRemainingTime] = useState(SESSION_DURATION);
    let intervalId = useRef(0);
    let timerId = useRef(0);
    const submit = useSubmit();
    const location = useLocation();

    const refreshTime = () => {
      setRemainingTime(prev=>{return (prev > 0)?(prev - 1000):0});
    };

    //Count Down
    useEffect(() => {
      intervalId.current = setInterval(refreshTime, 1000);
      return () => clearInterval(intervalId.current);
    }, []);

    //Time Out
    useEffect(() => {
      timerId.current = setTimeout(() => {
        submit(null, { action: "/timeout" });
        clearTimeout(timerId.current);
      }, SESSION_DURATION);
      
      if(location.pathname!="/timeout"){
        setRemainingTime(SESSION_DURATION);
      }

      return () => clearTimeout(timerId.current);
    }, [submit, location]);

    return (<p>Remaining Session Time {new Intl.DateTimeFormat('es-Ar',{minute: "numeric", second: "numeric", }).format(remainingTime)}</p>);
};

export const useExampleContact = ()=>{
  // const [firstTime, setFirstTime] = useState(true)
  let firstTime = true;
  const submit=useSubmit();

  useEffect(()=>{
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt= Date.now();

    if(firstTime===true){
      firstTime = false;
      getContacts().then(
        (contactList)=>{
          if(contactList.length===0){
            let contact = { 
              "id": id,
              "createdAt": createdAt,
              "first": "German",
              "last": "Levental",
              "twitter": "@germanlevental",
              "avatar": "https://media.licdn.com/dms/image/C4E03AQEYqNIBWkR25g/profile-displayphoto-shrink_200_200/0/1556768978154?e=1701302400&v=beta&t=LM8LtMFOf7XEpWBreLzg9M-zoQMmZ8OWQYNmS2caT24",
              "notes": "This is an example of contact!",
              "favorite": true
            };
            createContact(contact).then(()=>{
              submit(null, {action: "/"});
            });
          }
        }
      )
    }
  },[]);
}

export const useEnvVariablesTest = ()=>{
  const [showTestInfo, setShowTestInfo] = useState(false);

  if(showTestInfo){
    //Env Variables:
    console.log("# Env Variables:");
    console.log("BASE_URL: "+import.meta.env.BASE_URL);
    console.log("MODE: "+import.meta.env.MODE);
    console.log("PROD: "+import.meta.env.PROD);
    console.log("DEV: "+import.meta.env.DEV);
  
    //Env Development:
    console.log("\n# import.meta.env.development:");
    console.log("VITE_BASENAME:"+import.meta.env.VITE_BASENAME);
    console.log("VITE_MY_VARIABLE_ENV_DEVELOPMENT:"+import.meta.env.VITE_MY_VARIABLE_ENV_DEVELOPMENT);
    console.log("MY_VARIABLE_ENV_DEVELOPMENT:"+import.meta.env.MY_VARIABLE_ENV_DEVELOPMENT); //Undefined, porque si no empieza por VITE_ no puede ser leida directamente con el import.meta.env
  
    //Env Production:
    console.log("\n# import.meta.env.production:");
    console.log("VITE_BASENAME:"+import.meta.env.VITE_BASENAME);
    console.log("VITE_MY_VARIABLE_ENV_PRODUCTION:"+import.meta.env.VITE_MY_VARIABLE_ENV_PRODUCTION);
    console.log("MY_VARIABLE_ENV_PRODUCTION:"+import.meta.env.MY_VARIABLE_ENV_PRODUCTION); //Undefined, porque si no empieza por VITE_ no puede ser leida directamente con el import.meta.env
  
    if(import.meta.env.DEV){
      //Config Serve:
      console.log("\n# Env Config Serve:");
      console.log("MY_VARIABLE1_CONFIG_SERVE: "+MY_VARIABLE1_CONFIG_SERVE);
      console.log("MY_VARIABLE2_CONFIG_SERVE: "+MY_VARIABLE2_CONFIG_SERVE);
      console.log("MY_VARIABLE3_CONFIG_SERVE: "+MY_VARIABLE3_CONFIG_SERVE);
      console.log("MY_VARIABLE4_CONFIG_SERVE: "+MY_VARIABLE4_CONFIG_SERVE);
      console.log("MY_VARIABLE5_CONFIG_SERVE: "+MY_VARIABLE5_CONFIG_SERVE);
      console.log("MY_VARIABLE6_CONFIG_SERVE: "+MY_VARIABLE6_CONFIG_SERVE);
    } else {
      console.log("\n# Env Config Serve: FALSE");
    }
  
    if(import.meta.env.PROD){
      //Config Build:
      console.log("\n# Env Config Build:");
      console.log("MY_VARIABLE1_CONFIG_BUILD: "+MY_VARIABLE1_CONFIG_BUILD_1);
      console.log("MY_VARIABLE2_CONFIG_BUILD: "+MY_VARIABLE2_CONFIG_BUILD_2);
      console.log("MY_VARIABLE3_CONFIG_BUILD: "+MY_VARIABLE3_CONFIG_BUILD_3);
    } else {
      console.log("\n# Env Config Build: FALSE");
    }

  }
  return [showTestInfo, setShowTestInfo];
}