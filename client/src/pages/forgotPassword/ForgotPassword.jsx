import { useState } from "react";
import "./forgotPassword.css"
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e)=>{
    setEmail(e.target.value);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{
        const res = await axios.put(`${process.env.REACT_APP_API}/auth/forgotPassword`, {email});
        console.log(res);
        setMessage(res.data);
    }catch(err){
        console.log(err);
        setMessage(err.response.data);
    }
  }

  return (
    <div className="forgot-password">
        <span className="forgot-password-title">Forgot Password</span>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
            <label>Enter your registered email address to reset your password</label>
            <input required type="email" className="forgot-password-input" onChange={handleChange}/>
            <button className="forgot-password-button">Send</button>
            {message && (
                <p>{message}</p>
            )}
        </form>
    </div>
  )
}
