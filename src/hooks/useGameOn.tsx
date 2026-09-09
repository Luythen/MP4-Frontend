import { useEffect, useState } from "react";
import { subscribe, unSubscribe } from "../stomp";

export default function useGameOn() {
  const [started, setStarted] = useState<boolean>(false);
  const subscribePath = "/topic/startgame";

  useEffect(() => {
    subscribe((g: boolean) => {
      setStarted(g);
    }, subscribePath);

    return () => {
      unSubscribe(subscribePath);
    };
  }, []);
  
  return { started };
}
