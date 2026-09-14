import { useEffect, useState } from "react";
import { subscribe, unSubscribe } from "../stomp";import type { PlayerInformation } from "../interface/PlayerInformation";

function useScoreBoard () {
    const [scoreBoard, setScoreBoard] = useState<Map<string, PlayerInformation>>(new Map())
    const subscribePath = "/topic/scoreboard"

    useEffect(() => {
        subscribe((p: Record<string, PlayerInformation>) => {
            setScoreBoard(new Map(Object.entries(p)))
        }, subscribePath)

        return () => {
            unSubscribe(subscribePath);
        }
    }, [])

    return { scoreBoard }
}

export default useScoreBoard;