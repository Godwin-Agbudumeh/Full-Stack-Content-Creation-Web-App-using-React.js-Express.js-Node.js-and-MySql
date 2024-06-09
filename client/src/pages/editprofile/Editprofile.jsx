import  "./editprofile.css";
import {useLocation, useNavigate} from "react-router";
import { useState, useContext } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import humanAvatar from "../../images/humanAvatar.png"

export default function Editprofile() {
    const {state} = useLocation();
    console.log(state)
    const [firstname, setFirstname] = useState(state?.firstname || "");
    const [lastname, setLastname] = useState(state?.lastname || "");
    const [email, setEmail] = useState(state?.email || "");
    const [about, setAbout] = useState(state?.about || "");
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState(null);
    const [userProfileSuccessMessage, setUserProfileSuccessMessage] = useState(false);
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(false);
    const [imageSuccessMessage, setImageSuccessMessage] = useState(false);
    const [aboutSuccessMessage, setAboutSuccessMessage] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [isPhotoFetching, setIsPhotoFetching] = useState(false);
    const [isUserDeatailsFetching, setIsUserDeatailsFetching] = useState(false);

    
    const PF = `${process.env.REACT_APP_IMAGE_LINK}`;
    
    //we are destruturing the context value which is an object, 
    //and extracting dispatch
    const { currentUser, dispatch } = useContext(Context)

    const navigate = useNavigate();

    const handleSubmitDetails = async (e)=>{
      e.preventDefault();
      setIsUserDeatailsFetching(true);

      const myProfile = {
        firstname,
        lastname,
        email,
      }

      try{
        const res = await axios.put(`${process.env.REACT_APP_API}/users`, myProfile);
        console.log(res)

        dispatch({type: "LOGIN_SUCCESS", payload:res.data.data})

        setUserProfileSuccessMessage(true);

        setTimeout(()=>{
          setUserProfileSuccessMessage(false)
        }, 7000)

        setIsUserDeatailsFetching(false);
      }catch(err){
        console.log(err);
      }
    }

    const handleSubmitPhoto = async (e)=>{
      e.preventDefault();
      setIsPhotoFetching(true);

      if(file){
        const formData = new FormData();
        //Date.now incase user uploads file with same 
        //name already uploaded to server, also file.name comes from our input field from user ie e.target.files
        //also filename is name of file that will be same in both server api and in mysql
        const filename = Date.now() + file.name;

        formData.append("name", filename);
        formData.append("file", file);

        try {
          // we are uploading file from user pc to images folder in server api.
          const res = await axios.post(`${process.env.REACT_APP_API}/upload`, formData);

          console.log(res.data);

          const version = res.data.data.version;
          const publicid =  res.data.data.public_id;
          const format =  res.data.data.format;
  
          console.log(version)
          console.log(publicid)
          console.log(format)
      
          if(version){
            const res = await axios.put(`${process.env.REACT_APP_API}/users`, {img: `${version}/${publicid}.${format}`});
            console.log(res);
    
            dispatch({type: "LOGIN_SUCCESS", payload:res.data.data});
    
            setImageSuccessMessage(true);

            setTimeout(()=>{
              setImageSuccessMessage(false)
            }, 7000)

            setIsPhotoFetching(false);
          }
        }catch(err){
          console.log(err);
        }
     }
    }

    const handleSubmitPassword = async (e)=>{
      e.preventDefault();

      try{
        const res = await axios.put(`${process.env.REACT_APP_API}/users`, {password: password});
        console.log(res)

        dispatch({type: "LOGIN_SUCCESS", payload:res.data.data})

        setPasswordSuccessMessage(true);

        setTimeout(()=>{
          setPasswordSuccessMessage(false)
        }, 7000)
      }catch(err){
        console.log(err);
      }
    }

    const handleSubmitAbout = async(e)=>{
      e.preventDefault();

      try{
        const res = await axios.put(`${process.env.REACT_APP_API}/users`, {about: about});
        console.log(res)

        dispatch({type: "LOGIN_SUCCESS", payload:res.data.data})

        setAboutSuccessMessage(true);

        setTimeout(()=>{
          setAboutSuccessMessage(false)
        }, 7000)
      }catch(err){
        console.log(err);
      }
    }

    const handleProfileView = ()=>{
      navigate(`/profile/${state?.id}`);
    }

    const handleResetPasswordForm = ()=>{
      setChangePassword(!changePassword)
    }

    return (
        <>
          <div className="edit-profile">
            <span>Edit your profile</span>
            <form className="user-details-form" onSubmit={handleSubmitDetails}>
                <p className="user-details-heading">User Details</p>
                <label>Firstname</label>
                <input required type="text" placeholder="Firstname" name="firstname" value={firstname} onChange={(e)=>{setFirstname(e.target.value)}}/>
                <label>Lastname</label>
                <input required type="text" placeholder="Lastname" name="lastname" value={lastname} onChange={(e)=>{setLastname(e.target.value)}}/>
                <label>Email</label>
                <input required type="email" placeholder="Email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                <button type="submit" className="user-details-button" disabled={isUserDeatailsFetching}>Update User Details</button>
                {userProfileSuccessMessage && (
                <p style={{color: "red"}}>User details changed successfully</p>
              )}
            </form>
            <form className="profile-photo-form" onSubmit={handleSubmitPhoto}>
                <p>Profile photo</p>
                <img src={currentUser.img ? PF + currentUser?.img : humanAvatar} alt=""/>
                <label htmlFor="file">Choose profile photo</label>
                <input required type="file" id="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
                <button className="profile-photo-button" type="submit" disabled={isPhotoFetching}>Update Profile Photo</button>
                {imageSuccessMessage && (
                <p style={{color: "red"}}>Profile photo changed successfully</p>
              )}
            </form>
            <form className="about-me-form" onSubmit={handleSubmitAbout}>
              <p>About me</p>
              {/* <input type="text" name="about" value={about} onChange={(e)=>{setAbout(e.target.value)}}/> */}
             <textarea required type="text" name="about" cols="30" rows="10" value={about} onChange={(e)=>{setAbout(e.target.value)}}></textarea>
              <button type="submit">Update About Me</button>
              {aboutSuccessMessage && (
                <p style={{color: "red"}}>About me updated successfully</p>
              )}
            </form>
            {
              changePassword ? (
                <button onClick={handleResetPasswordForm} className="reset-password-button">Cancel</button>
              ):(
                <button onClick={handleResetPasswordForm} className="reset-password-button">Reset password</button>
              )
            }
            {changePassword && (
            <form className="change-password-form" onSubmit={handleSubmitPassword}>
              <label>Enter new password</label>
              <p>Please take note of your new password</p>
              <input required type="text" onChange={(e)=>{setPassword(e.target.value)}}/>
              <button type="submit">Update Password</button>
              {passwordSuccessMessage && (
                <p style={{color: "red"}}>Password changed successfully</p>
              )}
            </form>
            )}
            <button onClick={handleProfileView} className="view-profile">View Complete Profile</button>
          </div>
        </>
    )
}