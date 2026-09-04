import { useState } from "react"
import { sendMessage } from "../stomp";

function PlayerNameForm() {
    const [name, setName] = useState<string>()
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const publishName = (name: string) => {
        sendMessage("/app/setname", name)
    }

    return (
        <form onSubmit={() => publishName(name!)}>
            <input 
            required
            placeholder="Enter your name"
            type="text" 
            onChange={handleChange}/>
            <button type="submit">Send Name</button>
        </form>
    )
}

export default PlayerNameForm