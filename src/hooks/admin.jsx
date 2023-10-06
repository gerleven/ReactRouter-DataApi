import { useState, useEffect } from "react";
import { useSubmit, useLocation } from "react-router-dom";


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