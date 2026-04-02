import { useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className="h-dvh grid place-items-center ">
			<div className="bg-gray-100 w-md p-9 rounded-xl ">
				<h1 className="text-2xl font-medium" >{isLogin ? "Welcome Back" : "Sign in to Kantion"}</h1>
				<div className="flex border border-gray-400 my-6 rounded-md overflow-hidden">
                    <button className={`${isLogin ? "bg-gray-900 text-white" : "bg-white text-gray-900" } font-medium w-full px-3 py-2`} onClick={() => setIsLogin(true)}>Login</button>
					<button className= {`${!isLogin ? "bg-gray-900 text-white" : "bg-white text-gray-900" } font-medium w-full px-3 py-2`} onClick={() => setIsLogin(false)}>Register</button>
				</div>

                {isLogin ? <Login /> : <Signup/>}
			</div>
		</div>
	);
}
