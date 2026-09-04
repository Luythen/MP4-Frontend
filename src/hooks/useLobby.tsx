import { useEffect, useState } from "react";
import { subscribe } from "../stomp";

function useLobby () {
    const [playerNames, setPlayerNames] = useState<string[]>([])
    const subscribePath = "/topic/lobby"

    useEffect(() => {
        const unSubscribe = subscribe((p: string[]) => {
            setPlayerNames(p)
        }, subscribePath)

        return () => {
            unSubscribe()
        }
    })

    return { playerNames }
}

export default useLobby;