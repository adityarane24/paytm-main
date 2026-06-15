import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        // PERMANENT FIX: Send network request directly to your live production server
        axios.get("https://paytm-backend-api.vercel.app/api/v1/user/bulk?filter=" + filter, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(response => {
            // Added safe check fallback array structure to ensure map() never crashes
            setUsers(response.data.user || []);
        })
        .catch(error => {
            console.error("Error fetching users from database pipeline:", error);
        });
    }, [filter]);

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e) => {
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div className="space-y-2 mt-4">
            {users.map(user => <User key={user._id} user={user} />)}
        </div>
    </>
}

function User({ user }) {
    const navigate = useNavigate();

    return <div className="flex justify-between items-center py-2 border-b border-slate-100">
        <div className="flex items-center">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-3">
                <div className="text-xl font-semibold uppercase">
                    {user.firstName && user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <div className="font-medium text-slate-800">
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center">
            <Button onClick={(e) => {
                navigate("/send?id=" + user._id + "&name=" + user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}