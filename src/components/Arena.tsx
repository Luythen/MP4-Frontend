import { useEffect, useRef } from "react";
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

    const WIDTH = 1000;
    const HEIGHT = 700;

    const SIZE_W = 100;
    const SIZE_H = 50;

    const MARGIN = 10;
    const OPTIONS_SIZE_W = 350;
    const OPTIONS_SIZE_H = 150;

    const answer_square = [
        { x: MARGIN, y: MARGIN, w: OPTIONS_SIZE_W, h: OPTIONS_SIZE_H, answer: options[0] },
        { x: WIDTH-OPTIONS_SIZE_W-MARGIN, y: MARGIN, w: OPTIONS_SIZE_W, h: OPTIONS_SIZE_H, answer: options[1] },
        { x: MARGIN, y: HEIGHT - OPTIONS_SIZE_H - MARGIN, w: OPTIONS_SIZE_W, h: OPTIONS_SIZE_H, answer: options[2] },
        { x: WIDTH-OPTIONS_SIZE_W-MARGIN, y: HEIGHT - OPTIONS_SIZE_H - MARGIN, w: OPTIONS_SIZE_W, h: OPTIONS_SIZE_H, answer: options[3] },
    ]

    function rectsOverlap (
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number
    ) {
        return x2 < x1 + w1 &&
            x2 + w2 > x1 &&
            y2 < y1 + h1 &&
            y2 + h2 > y1
    }

    useEffect(() => {
        const move = (event: KeyboardEvent) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
                sendMessage("/app/move", event.key)
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

            const BORDER_MARGIN = 8;
            answer_square.map((sq) => {
                ctx.strokeStyle = "yellow";
                ctx.lineWidth = 3;
                ctx.strokeRect(sq.x + BORDER_MARGIN, sq.y + BORDER_MARGIN, sq.w - BORDER_MARGIN * 2, sq.h - BORDER_MARGIN * 2)
                /* Version 1 style
                ctx.fillStyle = "yellow"
                ctx.fillRect(sq.x, sq.y, sq.w, sq.h)
 */
                ctx.fillStyle = "Black"
                ctx.font = "20px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle";
                ctx.fillText(sq.answer, sq.x + OPTIONS_SIZE_W / 2, sq.y + OPTIONS_SIZE_H / 2)
            })

            players.forEach((info, _p) => {
                if (localStorage.getItem("name") != null && localStorage.getItem("name") === _p) {
                    const p_answer = answer_square.filter((sq) => rectsOverlap(info.posX, info.posY, SIZE_W, SIZE_H, sq.x, sq.y, sq.w, sq.h))
                    sendAnswer(p_answer.length > 0 ? p_answer[0].answer : "blank");
                }
                ctx.beginPath();
                ctx.fillStyle = info.color;
                ctx.strokeStyle = "black";
                ctx.rect(info.posX, info.posY, SIZE_W, SIZE_H);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "Black"
                ctx.font = "12px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle";
                ctx.fillText(_p, info.posX + SIZE_W / 2, info.posY + SIZE_H / 2)
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