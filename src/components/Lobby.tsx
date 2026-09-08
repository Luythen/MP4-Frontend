import useLobby from "../hooks/useLobby";
import useTimer from "../hooks/useTimer";
import { sendMessage } from "../stomp";
import PlayerNameForm from "./PlayerNameForm";

function Lobby () {
    const { playerNames } = useLobby();
    const { timer } = useTimer();

    const PlayerList = () => {
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }

    const startTimer = () => {
        sendMessage("/app/send-time-left", null);
    }
    
    return (
        <div>
            <h1>{timer.toString()}</h1>
            <PlayerList />
            <PlayerNameForm />
            <button onClick={startTimer}>Start timer</button>
        </div>
    )
}

export default Lobby;