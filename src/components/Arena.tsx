import { useEffect, useRef, useState } from "react";
import { sendMessage } from "../stomp";
import usePlayerMove from "../hooks/usePlayerMove";
import useGameOn from "../hooks/useGameOn";
import useQuestion from "../hooks/useQuestion";
import type { QuestionModel } from "../interface/QuestionModel";
import useScore from "../hooks/useScore";

export default function Arena ({ options }: QuestionModel) {
    const { players } = usePlayerMove();
    const { started } = useGameOn();
    const { getQuestion  } = useQuestion();
    const { sendAnswer } = useScore();
    const canvasRef = useRef(null)

    const [answer, setAnswer] = useState<string | null>(null) 

    const WIDTH = 1000;
    const HEIGHT = 700;

    const SIZE = 50;

    const MARGIN = 10;
    const OPTIONS_SIZE = 75;

    const answer_square = [
        { x: MARGIN, y: MARGIN, w: OPTIONS_SIZE, h: OPTIONS_SIZE, answer: options[0] },
        { x: WIDTH-OPTIONS_SIZE-MARGIN, y: MARGIN, w: OPTIONS_SIZE, h: OPTIONS_SIZE, answer: options[1] },
        { x: MARGIN, y: HEIGHT - OPTIONS_SIZE - MARGIN, w: OPTIONS_SIZE, h: OPTIONS_SIZE, answer: options[2] },
        { x: WIDTH-OPTIONS_SIZE-MARGIN, y: HEIGHT - OPTIONS_SIZE - MARGIN, w: OPTIONS_SIZE, h: OPTIONS_SIZE, answer: options[3] },
    ]

    function rectsOverlap (
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number,
        answer: string
    ) {
        if (
            x2 < x1 + w1 &&
            x2 + w2 > x1 &&
            y2 < y1 + h1 &&
            y2 + h2 > y1
        ) {
            return answer;
        }

        return null;
    }

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
    })

    useEffect(() => {
        const arena = canvasRef.current ?? document.getElementById("arena") as HTMLCanvasElement;
        const ctx = arena.getContext("2d");
        
        if (ctx != null) {
            ctx.clearRect(0,0, WIDTH, HEIGHT);

            ctx.fillStyle = "yellow"
            ctx.fillRect(MARGIN, MARGIN, OPTIONS_SIZE, OPTIONS_SIZE)
            ctx.fillRect(WIDTH-OPTIONS_SIZE-MARGIN, MARGIN, OPTIONS_SIZE, OPTIONS_SIZE)
            ctx.fillRect(MARGIN, HEIGHT - OPTIONS_SIZE - MARGIN, OPTIONS_SIZE, OPTIONS_SIZE)
            ctx.fillRect(WIDTH - OPTIONS_SIZE - MARGIN, HEIGHT - OPTIONS_SIZE - MARGIN, OPTIONS_SIZE, OPTIONS_SIZE)

            players.forEach((info, _p) => {
                answer_square.map((r) => {
                    const answer = rectsOverlap(info.posX, info.posY, SIZE, SIZE, r.x, r.y, r.w, r.h, r.answer)
                    if (answer != null) {
                        setAnswer(answer);
                    }
                })
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
                if (answer != null) {
                    sendAnswer(answer);
                    setAnswer(null);
                }
            }
            else {
                console.log("NOT ALLOWED");    
            }
        }

        if (!started) {
            getQuestion();
            setTimeout(startGame, 10000)
        }
    }, [started])

    return (
        <canvas id="arena" ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    )
}