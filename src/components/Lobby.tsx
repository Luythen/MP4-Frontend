/* eslint-disable react-hooks/static-components */
import useLobby from "../hooks/useLobby";
import useTimer from "../hooks/useTimer";
import PlayerNameForm from "./PlayerNameForm";
import Arena from "./Arena";
import useQuestion from "../hooks/useQuestion";
import useScoreBoard from "../hooks/useScoreBoard";

function Lobby () {
    const { playerNames } = useLobby();
    const { timer } = useTimer();
    const { question } = useQuestion();
    const { scoreBoard } = useScoreBoard();

    const PlayerList = () => {
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }

    const ScoreBoard = () => {
        return <table>  
            <tr>
                <th>name</th>
                <th>score</th>
            </tr>
            {[...scoreBoard.keys()].map(s => (
                <tr>
                    <td>{s}</td>
                    <td>{scoreBoard.get(s)?.score}</td>
                </tr>
            ))}
        </table>
    }
    
    return (
        <div>
            <div id="aboveCanvas">
                { [...playerNames.keys()].length === 3 ? <p id="question">{question === null ? "waiting for question" : question.question}</p> : <p></p> }
                <p id="timer">TIME: {timer.toString()}</p>
            </div>
            { [...playerNames.keys()].length === 3 ? <Arena options={question === null ? [] : question.options} id={""} question={""} category={""} correctAnswer={""} /> : <div>
                <PlayerList />
                <PlayerNameForm />
            <ScoreBoard />
            </div>}
        </div>
    )
}

export default Lobby;