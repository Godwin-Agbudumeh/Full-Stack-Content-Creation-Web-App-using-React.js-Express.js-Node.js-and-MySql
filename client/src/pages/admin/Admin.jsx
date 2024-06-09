import { useState } from "react";
import axios from "axios";
import { Link }from "react-router-dom";

export default function Admin() {
  const [deleteUserInput, setDeleteUserInput] = useState(null);
  const [deletePostInput, setDeletePostInput] = useState(null);
  const [viewUserInput, setViewUserInput] = useState(null);
  const [viewPostInput, setViewPostInput] = useState(null);

  const [deleteUserMessage, setDeleteUserMessage] = useState(null);
  const [deletePostMessage, setDeletePostMessage] = useState(null);

  const handleUserChange = (e)=>{
    setDeleteUserInput(e.target.value);
  }

  const handlePostChange = (e)=>{
    setDeletePostInput(e.target.value);
  }

  const handleViewUserChange = (e)=>{
    setViewUserInput(e.target.value);
  }

  const handleViewPostChange = (e)=>{
    setViewPostInput(e.target.value);
  }


  const handleUserSubmit = async (e)=>{
    e.preventDefault();

    try{
        const res = await axios.delete(`/admin/user/${deleteUserInput}`);
        console.log(res);
        setDeleteUserMessage(res.data);
    }catch(err){
        if(err)console.log(err);
        setDeleteUserMessage(err.response.data);
    }
  }

  const handlePostSubmit = async (e)=>{
    e.preventDefault();

    try{
        const res = await axios.delete(`/admin/post/${deletePostInput}`);
        console.log(res);
        setDeletePostMessage(res.data);
    }catch(err){
        if(err)console.log(err);
        setDeletePostMessage(err.response.data);
    }
  }

  return (
    <div>
        <form>
            <label>Enter User Id</label>
            <input type="text" onChange={handleUserChange}/>
            <button onClick={handleUserSubmit}>Delete User</button>
        </form>
        {
            deleteUserMessage && (
                <p>{deleteUserMessage}</p>
            )
        }
        
        <form>
            <label>Enter Post Id</label>
            <input type="text" onChange={handlePostChange}/>
            <button onClick={handlePostSubmit}>Delete Post</button>
        </form>
        {
            deletePostMessage && (
                <p>{deletePostMessage}</p>
            )
        }

        <form>
            <label>Enter User Id</label>
            <input type="text" onChange={handleViewUserChange}/>
            <Link to={`/profile/${viewUserInput}`}>View User</Link>
        </form>

        <form>
            <label>Enter Post Id</label>
            <input type="text" onChange={handleViewPostChange}/>
            <Link to={`/post/${viewPostInput}`}>View Post</Link>
        </form>
    </div>
  )
}
