import { useState, useEffect } from "react";

const SESSION_DURATION = 3;
const TEST_MODE = true;

//Este es el que anda bien!
export const useSessionTime1 = () => {
    const [remainingTime, setRemainingTime] = useState(SESSION_DURATION);
    let timer = 0;
    TEST_MODE && console.log("2)### timer declarado: "+timer)
  
    const stopTimer = () => {
        TEST_MODE && console.log("2)### limpiar timer "+timer)
      clearInterval(timer);
    };
  
    useEffect(() => {
      timer = setInterval(() => {
        TEST_MODE && console.log("2)### Funcion interna del setInterval - "+timer);
        setRemainingTime(prevRemainingTime => {
          if (prevRemainingTime > 0) {
            return prevRemainingTime - 1;
          } else {
            stopTimer(); // Limpiar el intervalo cuando el tiempo se agota
            TEST_MODE && console.log('2)### ¡Tiempo agotado!'+timer);
            return 0;
          }
        });
      }, 1000);
      TEST_MODE && console.log("2)### Seteado un timer id: "+timer)

      return stopTimer; // Limpiar el intervalo al desmontar el componente
    }, []);
  
    return remainingTime;
  };

//useSessionTime con un segundo useEffect.
export const useSessionTime2 = () => {
  const [remainingTime, setRemainingTime] = useState(SESSION_DURATION);
  const [timerId, setTimerId] = useState(0);
  
  const stopTimer = (timer) => {
    TEST_MODE && console.log('3)### Limpiar el timer de id: '+timer);
    clearInterval(timer);
  };

  // Primer useEffect para restar 1 segundo
  useEffect(() => {
    let timer = setInterval(() => {
      TEST_MODE && console.log('3)### Intervalo corriendo: '+timer);
      setRemainingTime(prevRemainingTime => (prevRemainingTime - 1));
    }, 1000);
    setTimerId(timer);
    //Ojo! React ejecuta 2 veces el useEffect(f, []) para asegurarse que hiciste bien el sañamiento
    //Este setTimerId(timer) es asincronico, por lo tanto timerId sigue valiendo 0 cuando se ejecute el stopTimer(), por eso hay que pasarle el valor timer para que el sañamiento se haga correctamente entre el 1er y 2do useEffect(f, [])

    return () => {stopTimer(timer);} 
  }, []);

  // Segundo useEffect para comprobar si el tiempo se ha agotado
  useEffect(() => {
    if (remainingTime < 1) {
      TEST_MODE && console.log('3)### ¡Tiempo agotado!'+timerId);
      stopTimer(timerId); // Limpia el intervalo cuando el tiempo se agota
    }
  }, [remainingTime]);

  return remainingTime;
  };