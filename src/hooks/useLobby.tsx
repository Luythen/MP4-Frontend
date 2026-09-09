import { useEffect, useState } from "react";
import { subscribe, unSubscribe } from "../stomp";
import type { PlayerInformation } from "../interface/PlayerInformation";

function useLobby () {
    const [playerNames, setPlayerNames] = useState<Map<string, PlayerInformation>>(new Map())
    const subscribePath = "/topic/lobby"

    useEffect(() => {
        subscribe((p: Record<string, PlayerInformation>) => {
            setPlayerNames(new Map(Object.entries(p)))
        }, subscribePath)

        return () => {
            unSubscribe(subscribePath);
        }
    }, [])

    return { playerNames }
}

export default useLobby;