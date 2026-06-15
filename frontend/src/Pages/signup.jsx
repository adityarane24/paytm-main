import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
                <h1 className="text-3xl font-bold mb-4">Sign up</h1>
                
                {/* Note: Ensure your custom or standard inputs update their respective state variables on change */}
                <input type="text" placeholder="Aditya" className="border p-2 w-full mb-2 rounded" 
                    onChange={(e) => setFirstName(e.target.value)} />
                
                <input type="text" placeholder="Rane" className="border p-2 w-full mb-2 rounded" 
                    onChange={(e) => setLastName(e.target.value)} />
                
                <input type="email" placeholder="aditya@gmail.com" className="border p-2 w-full mb-2 rounded" 
                    onChange={(e) => setUsername(e.target.value)} />
                
                <input type="password" placeholder="123456" className="border p-2 w-full mb-4 rounded" 
                    onChange={(e) => setPassword(e.target.value)} />

                <button onClick={async () => {
                    const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                        username,
                        firstName,
                        lastName,
                        password
                    });
                    localStorage.setItem("token", response.data.token);
                    navigate("/dashboard");
                }} className="bg-slate-800 text-white p-2 w-full rounded hover:bg-slate-900">
                    Sign up
                </button>
            </div>
        </div>
    );
}