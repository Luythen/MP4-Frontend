import useLobby from "../hooks/useLobby";
import PlayerNameForm from "./PlayerNameForm";

function Lobby () {
    const { playerNames } = useLobby();
    
    return (
        <div>
            { playerNames }
            <PlayerNameForm />
        </div>
    )
}

export default Lobby;