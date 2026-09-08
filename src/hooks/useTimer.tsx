import { useEffect, useState } from "react"
import { subscribe, unSubscribe } from "../stomp"

export default function useTimer () {
    const [timer, setTimer] = useState<number>(0)
    const subscribePath = "/topic/send-timer"

    useEffect(() => {
        subscribe((t: number) => {
            setTimer(t)
        }, subscribePath)

        return () => {
            unSubscribe(subscribePath);
        }
    })
    return { timer };
}
