import "./register.css"
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [inputs, setInputs] = useState({
    firstname:"",
    lastname:"",
    email:"",
    password:"",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e)=>{
    setInputs((prev)=>{return ({...prev, [e.target.name]: e.target.value})});
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/auth/register`, inputs);
      console.log(res)
      navigate("/login");
    }catch(err){
      setError(err.response.data);
    }  
  };

  return (
    <div className="register">
        <span className="register-title">Register</span>
        <form className="register-form" onSubmit={handleSubmit}>
            <label>Firstname</label>
            <input required type="text" className="register-input" placeholder="Enter your firstname..." name="firstname" onChange={handleChange}/>
            <label>Lastname</label>
            <input required type="text" className="register-input" placeholder="Enter your lastname..." name="lastname" onChange={handleChange}/>
            <label>Email</label>
            <input required type="email" className="register-input" placeholder="Enter your email..." name="email" onChange={handleChange}/>
            <label>Password</label>
            <input required type="text" className="register-input" placeholder="Enter your password..." name="password" onChange={handleChange}/>
            <button type="submit" className="register-button">Register</button> 
        </form>
        {error && (<p style={{color:"red", padding:"6px"}}>{error}</p>)}
        <button className="register-login-button"><Link className="link" to="/login">Login</Link></button>
    </div>
  )
}
