import { useEffect, useState } from "react";
import { subscribe, unSubscribe } from "../stomp";

function useLobby () {
    const [playerNames, setPlayerNames] = useState<string[]>([])
    const subscribePath = "/topic/lobby"

    useEffect(() => {
        subscribe((p: string[]) => {
            setPlayerNames(p)
        }, subscribePath)

        return () => {
            unSubscribe(subscribePath);
        }
    })

    return { playerNames }
}

export default useLobby;