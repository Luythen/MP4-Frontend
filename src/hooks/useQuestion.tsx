import { useEffect, useState } from "react";
import type { QuestionModel } from "../interface/QuestionModel";
import { subscribe, unSubscribe, sendMessage } from "../stomp";


export default function useQuestion() {
    const [question, setQuestion] = useState<QuestionModel | null>(null);
    const subscribePath = "/topic/random-question";

    useEffect(() => {
        subscribe ((q: QuestionModel) => {
            setQuestion(q);
        }, subscribePath);

        return () => {
            unSubscribe(subscribePath);
        }
    }, []);

    const getQuestion = () => {
        sendMessage("/app/get-random-question", {});
    }

    return { question, getQuestion };

}