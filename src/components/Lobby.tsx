/* eslint-disable react-hooks/static-components */
import useLobby from "../hooks/useLobby";
import useTimer from "../hooks/useTimer";
import PlayerNameForm from "./PlayerNameForm";
import Arena from "./Arena";
import useQuestion from "../hooks/useQuestion";
import type { QuestionModel } from "../interface/QuestionModel";

function Lobby () {
    const { playerNames } = useLobby();
    const { timer } = useTimer();
    const { question } = useQuestion();

    const PlayerList = () => {
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }
    
    return (
        <div>
            <div>
                <h1>{timer.toString()}</h1>
                { [...playerNames.keys()].length === 2 ? <h1>{question === null ? "waiting for question" : question.question}</h1> : <p></p> }
            </div>
            { [...playerNames.keys()].length === 2 ? <Arena options={question === null ? [] : question.options} id={""} question={""} category={""} correctAnswer={""} /> : <div>
                <PlayerList />
                <PlayerNameForm />
            </div>}
        </div>
    )
}

export default Lobby;