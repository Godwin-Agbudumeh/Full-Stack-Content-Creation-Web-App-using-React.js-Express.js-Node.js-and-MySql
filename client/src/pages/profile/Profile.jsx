import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link }from "react-router-dom";
import {useLocation} from "react-router";
import humanAvatar from "../../images/humanAvatar.png"
import { Context } from "../../context/Context";
import  "./profile.css";

export default function Profile() {
 const [user, setUser] = useState({});
 
 const PF = `${process.env.REACT_APP_IMAGE_LINK}`;

 let {currentUser} = useContext(Context); 

 const location = useLocation();

 let profileId = location.pathname.split("/")[2];

    useEffect(()=>{
      if(currentUser?.id === +profileId){
        const fetchLoggedinProfile = async()=>{
        try {
        const res = await axios.get(`${process.env.REACT_APP_API}/users`);
        console.log(res);
        setUser(res.data);
        } catch(err){
            console.log(err);
            }
        }
        fetchLoggedinProfile();
        }else{
            const fetchSingleProfile = async()=>{
                try{
                    const res = await axios.get(`${process.env.REACT_APP_API}/users/` + profileId); 
                    console.log(res);
                    setUser(res.data);
                }catch(err){
                    console.log(err)
                }
            }
            fetchSingleProfile();
            }
        }, [profileId, currentUser?.id])

    return (
        <> 
            <div className="profile">
                {currentUser?.id === +profileId ? (
                    <h2>My Profile</h2>
                ):(
                    <h2>{user?.firstname + "'s profile"}</h2>
                )
                }
                {user?.about && <textarea className="about-me" cols="30" rows="10" value={user?.about}></textarea>}
                <p>Name: {`${user.firstname} ${user.lastname}`}</p>
                { currentUser?.id === +profileId &&
                    <>
                        <p>Email: {user.email}</p> 
                        <span style={{color:'red'}}>Please note that your email is private,  only you can see it</span>
                    </> 
                }
            </div>
            <div className="profile-photo-wrapper">
                <span>Profile Photo:</span>
                {user.img ? (
                <img src={PF + user.img} alt="profileimagezone" className="profile-photo"/>
                ):(
                <img src={humanAvatar} alt="profileimagezone" className="profile-photo"/>
                )
                }
            </div>

            {currentUser?.id === +profileId && !user?.about && (
                <div className="profile-help">
                    <p>Click on Edit profile icon below to edit profile and add an about me section</p>
                </div>
            )}
            
            {currentUser?.id === +profileId && (
            <Link to={`/editprofile?edit=${profileId}`} state={user} className="profile-edit">
                <i className="fa-regular fa-pen-to-square"></i>
            </Link>
            )}         
        </>
    )
}
