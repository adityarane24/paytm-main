import { BottomWarning } from "../Components/BottomWarning";
import { Heading } from "../Components/Heading";
import { SubHeading } from "../Components/SubHeading";
import { Button } from "../Components/Button";
import { InputBox } from "../Components/InputBox";

export const Signin = () => {
    return <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading lable={"Sign in"} />
                <SubHeading lable={"Enter your infromation to create an account"} />
                <InputBox placeholder="Aditya@gmail.com" label={"Email"} />
                <InputBox placeholder="123456" label={"Password"} />
                <div className="pt-4">
                    <Button label={"Sign in"} />
                </div>
                <BottomWarning label={"Dont't have an account?"} buttonText={"sign up"} to={"/signup"} />
            </div>
        </div>
    </div>
}