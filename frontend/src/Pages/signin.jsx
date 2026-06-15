import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../Components/BottomWarning";
import { Heading } from "../Components/Heading";
import { SubHeading } from "../Components/SubHeading";
import { Button } from "../Components/Button";
import { InputBox } from "../Components/InputBox";

export const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading lable={"Sign in"} />
                    <SubHeading lable={"Enter your information to log in to your account"} />
                    
                    <InputBox 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Aditya@gmail.com" 
                        label={"Email"} 
                    />
                    <InputBox 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="123456" 
                        label={"Password"} 
                    />
                    
                    <div className="pt-4">
                        <Button 
                            onClick={async () => {
                                try {
                                    // FIXED: Passing "username" instead of the undefined "email" reference
                                    const response = await axios.post("https://paytm-backend-api.vercel.app/api/v1/user/signin", {
                                        username, 
                                        password
                                    });
                                    
                                    localStorage.setItem("token", response.data.token);
                                    navigate("/dashboard");
                                } catch (error) {
                                    alert("Invalid credentials or server error!");
                                    console.error("Signin error:", error);
                                }
                            }} 
                            label={"Sign in"} 
                        />
                    </div>
                    
                    <BottomWarning label={"Don't have an account?"} buttonText={"sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    );
};