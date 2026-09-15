import { useState } from "react"
import { sendMessage } from "../stomp";

function PlayerNameForm() {
    const [name, setName] = useState<string>()
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const publishName = (event: React.SubmitEvent) => {
        sendMessage("/app/setname", name)
        localStorage.setItem("name", name != null ? name : "");
        event.preventDefault();
    }

    return (
        <form onSubmit={publishName} >
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