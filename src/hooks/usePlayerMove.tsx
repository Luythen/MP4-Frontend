import { useEffect, useState } from "react";
import { subscribe, unSubscribe } from "../stomp";
import type { PlayerInformation } from "../interface/PlayerInformation";

export default function usePlayerMove () {
    const [players, setPlayers] = useState<Map<string, PlayerInformation>>(new Map())
    const path = "/topic/move"

    useEffect(() => {
        subscribe((p: PlayerInformation) => {
            console.log(p)
            setPlayers(new Map(Object.entries(p)))
        }, path)
        return () => {
            unSubscribe(path);
        }
    }, [players])

    return { players }
}