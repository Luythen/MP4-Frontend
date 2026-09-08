/* eslint-disable react-hooks/static-components */
import useLobby from "../hooks/useLobby";
import useStartGame from "../hooks/useGameOn";
import useTimer from "../hooks/useTimer";
import { sendMessage } from "../stomp";
import PlayerNameForm from "./PlayerNameForm";

function Lobby () {
    const { playerNames } = useLobby();
    const { timer } = useTimer();
    const { started } = useStartGame();

    const PlayerList = () => {
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }

    const startGame = () => {
       if (!started) {
            sendMessage("/app/startgame", null)
        }
        else {
            console.log("NOT ALLOWED");
            
        }
    }
    
    return (
        <div>
            <h1>{timer.toString()}</h1>
            <PlayerList />
            <PlayerNameForm />
            <button onClick={startGame}>Start timer</button>
        </div>
    )
}

export default Lobby;