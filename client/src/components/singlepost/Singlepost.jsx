import "./singlepost.css";
import { Link, useNavigate }from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {useLocation} from "react-router";
import axios from "axios";
import moment from "moment";
import {Context} from "../../context/Context";
import Discus from "disqus-react";
import "highlight.js/styles/atom-one-dark.css";
//to be eble to use react quill classes
import "react-quill/dist/quill.snow.css";


export default function Singlepost() {
  const [post, setPost] = useState({});

  const PF = "http://localhost:5000/images/";

  //returns an object, that contains the post id, console.log(location).
  const location = useLocation();
  //location.pathname is a string that contains post id.
  //.split splits the string after "/",
  const postId = location.pathname.split("/")[2];

  //"localhost-3000-nMN5QRskNy.disqus.com"
  //localhost-k5efyjmw10

   //To use disqus
   const disqusShortname = process.env.DISQUS_SHORT_NAME;
   console.log(post)
   console.log(typeof(post.id))
   const disqusConfig = {
     url: `http://localhost:3000/${post.id}`,
     identifier: `#${post.id}`,
     title: post.title
   }

  const navigate = useNavigate();
  const {currentUser} = useContext(Context);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const res = await axios.get(`${process.env.REACT_APP_API}/posts/${postId}`);
        setPost(res.data);
      }catch(err){
        console.log(err);
      }
    }
    fetchData();
  },[postId]);

  const handleDelete = async()=>{
    try{
      await axios.delete(`${process.env.REACT_APP_API}/posts/${postId}`);
      navigate("/");
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="single-post">
      <div className="card">
          <div class="card-meta-blogpost">
              Posted by <Link to={`/profile/${post.uid}`} className="link card-meta-blogpost-author">{`${post.firstname} ${post.lastname}`}</Link> on {moment(post.date).format('ll')} {post?.cat && 
                ( <>
                  <span>in </span><Link to={`/?cat=${post.cat}`} className="link">{post.cat}</Link>
                  </>)}
          </div>

          <div className="card-image-box">
            {post.img &&
            <img src={PF + post.img} alt="" className="card-image"/>
            }
          </div>

          <div className="card-description">
            <span className="card-description-title">{post.title}</span>
            {/* if you dont put ? in currentUser?.username errors result, because if currentUser = null, due to not loggedin, code crashes*/
              currentUser?.id === post.uid && (
                <div className="card-edit-delete">
                  <Link to={`/write?edit=${postId}`} state={post}><i className="card-edit fa-regular fa-pen-to-square"></i></Link>
                  <i className="card-delete fa-solid fa-trash" onClick={handleDelete}></i>
                </div>
              )
            }
            <p className="card-description-post">
                <div className="ql-snow">
                  <div className="ql-editor">
                    <div dangerouslySetInnerHTML={{__html: post.desc}} /> 
                  </div>
                </div>
            </p>
          </div>
        </div>

        {
          currentUser?.role==="ADMIN" && (
            <div>
              <p>User Id = {post.uid}</p>
              <p>Post Id = {postId}</p>
            </div>
          )
        }

        <Discus.DiscussionEmbed 
          shortname= {disqusShortname}
          config = {disqusConfig}
        />
    </div>
  )
}
