/* eslint-disable react-hooks/static-components */
import useLobby from "../hooks/useLobby";
import useTimer from "../hooks/useTimer";
import PlayerNameForm from "./PlayerNameForm";
import Arena from "./Arena";

function Lobby () {
    const { playerNames } = useLobby();
    const { timer } = useTimer();

    const PlayerList = () => {
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }
    
    return (
        <div>
            <h1>{timer.toString()}</h1>
            { [...playerNames.keys()].length === 2 ? <Arena /> : <div>
                <PlayerList />
                <PlayerNameForm />
            </div>}
        </div>
    )
}

export default Lobby;