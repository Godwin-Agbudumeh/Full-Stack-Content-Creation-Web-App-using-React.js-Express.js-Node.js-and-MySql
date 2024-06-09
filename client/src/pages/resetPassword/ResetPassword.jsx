import { useState } from "react";
import "./resetPassword.css"
import axios from "axios";
import {useLocation} from "react-router";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState(null);
  const [showlogin, setShowlogin] = useState(false);
  const {search} = useLocation();
  const token = search.split("=")[1];

  const handleChange = (e)=>{
    setPassword(e.target.value);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{
        const res = await axios.put(`${process.env.REACT_APP_API}/auth/resetPassword/${token}`, {password});
        console.log(res);
        setMessage(res.data);
        setShowlogin(true);
    }catch(err){
        console.log(err);
        setMessage(err.response.data);
    }
  }

  return (
    <div className="reset-password">
        <span className="reset-password-title">Reset Password</span>
        <form className="reset-password-form" onSubmit={handleSubmit}>
            <label>Enter your new password</label>
            <input required type="text" className="reset-password-input" onChange={handleChange}/>
            <button className="reset-password-button">Send</button>
            {message && (
                <p>{message}</p>
            )}
            {showlogin && (
                <>
                    <p>Go to login page</p>
                    <Link to={'/login'}>Login</Link>
                </>
            )}
        </form>
    </div>
  )
}
