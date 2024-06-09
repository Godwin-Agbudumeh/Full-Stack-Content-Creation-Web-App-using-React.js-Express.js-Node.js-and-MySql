import "./login.css"
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";

export default function Login() {

  const [inputs, setInputs] = useState({
    email:"",
    password:"",
  });
  const [error, setError] = useState(null);

  //we are destruturing the context value which is an object, 
  //and extracting dispatch, isfetching from it.
  const { dispatch, isFetching } = useContext(Context); 

  const navigate = useNavigate();

  const handleChange = (e)=>{
    setInputs((prev)=>{return ({...prev, [e.target.name]: e.target.value})});
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    dispatch({type: "LOGIN_START"});
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/auth/login`, inputs);
      //console.log(res);
      dispatch({type: "LOGIN_SUCCESS", payload:res.data})
      navigate("/");
    }catch(err){
      //error data coming from backend from res.status(404), user not found, caught by catch block
      setError(err.response.data); //data coming from backend from res.status(404)
      dispatch({type: "LOGIN_FAILURE"})
    }  
  };

  return (
    <div className="login">
        <span className="login-title">Login</span>
        <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input required type="text" className="login-input" placeholder="Enter your email" name="email" onChange={handleChange}/>
            <label>Password</label>
            <input required type="password" className="login-input" placeholder="Enter your password..." name="password" onChange={handleChange}/>
            <button type="submit" className="login-button" disabled={isFetching}>Login</button>
        </form>
        {error && (<p style={{color:"red", padding:"6px"}}>{error}</p>)}
        <button className="login-register-button"><Link className="link" to="/register">Register</Link></button>
        <p>Forgot password? click <Link to={"/forgotpassword"}>here</Link></p>
    </div>
  )
}
