import { useEffect, useRef } from "react";
import { sendMessage } from "../stomp";
import usePlayerMove from "../hooks/usePlayerMove";
import useGameOn from "../hooks/useGameOn";

export default function Arena () {
    const { players } = usePlayerMove();
    const { started } = useGameOn();
    const canvasRef = useRef(null)

    const WIDTH = 800;
    const HEIGHT = 700;

    const SIZE = 50;

    useEffect(() => {
        const move = (event: KeyboardEvent) => {
            if (started) {
                if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
                    sendMessage("/app/move", event.key)
                }
            }
        }

        window.addEventListener("keydown", move)
        return () => {
            window.removeEventListener("keydown", move);
        }
    }, [])

    useEffect(() => {
        const arena = canvasRef.current ?? document.getElementById("arena") as HTMLCanvasElement;
        const ctx = arena.getContext("2d");

        if (ctx != null) {
            ctx.clearRect(0,0, WIDTH, HEIGHT);
            players.forEach((info, _p) => {
                ctx.beginPath();
                ctx.fillStyle = info.color;
                ctx.strokeStyle = "black";
                ctx.rect(info.posX, info.posY, SIZE, SIZE);
                ctx.fill();
                ctx.stroke();
            })
        }
    }, [players])

    useEffect(() => {
        const startGame = () => {
            if (!started) {
                sendMessage("/app/startgame", null)
            }
            else {
                console.log("NOT ALLOWED");    
            }
        }

        if (!started) {
            sendMessage("/app/get-random-question", null)
            setTimeout(startGame, 10000)
        }
    }, [started])

    return (
        <canvas id="arena" ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    )
}