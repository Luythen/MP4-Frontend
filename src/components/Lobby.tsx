import useLobby from "../hooks/useLobby";
import PlayerNameForm from "./PlayerNameForm";

function Lobby () {
    const { playerNames } = useLobby();

    const PlayerList = () => {
        console.log([...playerNames.keys()])
        return [...playerNames.keys()].map(v => (
            <h1>{ v }</h1>
        ))
    }
    
    return (
        <div>
            <PlayerList />
            <PlayerNameForm />
        </div>
    )
}

export default Lobby;