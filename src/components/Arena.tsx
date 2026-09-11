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
    const OPTIONS_SIZE = 100;

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

        return "blank";
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

            answer_square.map((sq) => {
                ctx.fillStyle = "yellow"
                ctx.fillRect(sq.x, sq.y, sq.w, sq.h)

                ctx.fillStyle = "Black"
                ctx.font = "16px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle";
                ctx.fillText(sq.answer, sq.x + OPTIONS_SIZE / 2, sq.y + OPTIONS_SIZE / 2)
            })

            players.forEach((info, _p) => {
                answer_square.map((r) => {
                    const answer = rectsOverlap(info.posX, info.posY, SIZE, SIZE, r.x, r.y, r.w, r.h, r.answer)
                    sendAnswer(answer);
                })
                ctx.beginPath();
                ctx.fillStyle = info.color;
                ctx.strokeStyle = "black";
                ctx.rect(info.posX, info.posY, SIZE, SIZE);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "Black"
                ctx.font = "12px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle";
                ctx.fillText(_p, info.posX + SIZE / 2, info.posY + SIZE / 2)
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
        <div style={{display: "flex"}}>
            <canvas id="arena" ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
            <table>
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
                { [...players.keys()].map((p) => (
                    <tr>
                        <td>{ p }</td>
                        <td>{ players.get(p)?.score }</td>
                    </tr>
                )) }
            </table>
        </div>
    )
}