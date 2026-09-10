import { useEffect, useState } from "react";
import { subscribe, unSubscribe, sendMessage } from "../stomp";

export default function useScore() {

    const [score, setScore] = useState<number>(0);
    const subscribePath = "/topic/score-update";

    useEffect(() => {
        subscribe((s:number) => {
            setScore(s);
        }, subscribePath);

        return () => {
            unSubscribe(subscribePath);
        };
    }, []);

    const sendAnswer = (answer: string) => {
        sendMessage("/app/send-player-answer", answer);
    };
    return { score, sendAnswer };
}