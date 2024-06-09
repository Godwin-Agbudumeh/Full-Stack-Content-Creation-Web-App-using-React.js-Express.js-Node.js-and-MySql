import React, { useMemo, useState, useRef } from "react";
import { useNavigate }from "react-router-dom";
import {useLocation} from "react-router";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./write.css";
import moment from "moment";

export default function Write() {
  const state = useLocation().state;
  console.log(useLocation())
  console.log(state);

  const navigate = useNavigate();

  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [cat, setCat] = useState(state?.cat || "");

  const quillRef = useRef();

  //Handling images in react quill content
  const imageHandler = ()=>{
    alert("Although images can be useful, " +  
    "please make sure that your audience can still understsand your content without them. \n \n" + 
    "Try and type the actual code into your post using code-block '<>' along side the image of code.");

    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async ()=>{
        const file = input.files[0];

        if(file.size > 2097152) {
            return alert("File is too big, file must be less than 2 mb")
        };

        const formData = new FormData();

        const filename = Date.now() + file.name;
        formData.append('name', filename);
        formData.append('file', file);

        const quill = quillRef.current.getEditor();

        //Save current cursor state
        const range = quill.getSelection(true);

        //Move cursor to right side of image (easier to continue typing)
        quill.setSelection(range.index + 1);

        // we are uploading file from user pc to images folder in server api.
        const res = await axios.post(`${process.env.REACT_APP_API}/upload`, formData);

        console.log(res.data);

        const imageurl = `${res.data.data.version}/${res.data.data.public_id}.${res.data.data.format}`;

        const PF = `${process.env.REACT_APP_IMAGE_LINK}`;

        const serverImage = PF + imageurl;
        
        //Remove placeholder image
        quill.deleteText(range.index, 1);

        //Insert uploaded image
        quill.insertEmbed(range.index, 'image', serverImage);
    };
}

 const toolbarOptions = {
    container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
    
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
    
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        ['image', 'link'],
    
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
    
        ['clean'], 
    ],                                      // remove formatting button

    handlers: {
        image: imageHandler
    },
};

//note: useMemo prevents the editor from disappearing 
const modules = useMemo(()=>{
    return {
        syntax: {
            highlight: function (text){
                    return hljs.highlightAuto(text).value;
                },
            },

        toolbar: toolbarOptions,
        }
}, []);

  const handleClick = async (e)=>{
    e.preventDefault();
    const myPost = {
        title,
        desc: value,
        cat,
      };

    try{
        state ? await axios.put(`${process.env.REACT_APP_API}/posts/${state?.id}`, myPost)
        : await axios.post(`${process.env.REACT_APP_API}/posts/`, {...myPost, date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")});
        
        navigate("/");
    }catch(err){
        console.log(err);
      }
  }
 
  return (
    <form className="add" onSubmit={handleClick}>
        <div className="content">
            <input required type="text" placeholder="Title" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
            <div className="editor-container">
                <ReactQuill ref={quillRef} modules={modules} className="editor" theme="snow" value={value} onChange={setValue}/>
            </div>
        </div>
        <div className="menu">
            <div className="item">
                <h1>Publish</h1>
                <span><b>Visibility: </b>Public</span>
                <div className="buttons">
                    {/* <button onClick={handleClick}>Publish</button> */}
                    <button type="submit">Publish</button>
                </div>
            </div>
            <div className="item">
                <h1>Category</h1>
                <div className="cat">
                    <input type="radio" checked={cat==="Frontend"} name="cat" value="Frontend" id="frontend" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="frontend">Frontend</label>
                    <input type="radio" checked={cat==="Backend"} name="cat" value="Backend" id="backend" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="backend">Backend</label>
                    <input type="radio" checked={cat==="Technology"} name="cat" value="Technology" id="technology" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="technology">Technology</label>
                    <input type="radio" checked={cat==="Programming"} name="cat" value="Programming" id="programming" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="programming">Programming</label>
                    <input type="radio" checked={cat==="General"} name="cat" value="General" id="general" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="general">General</label>
                    <input type="radio" checked={cat==="Future"} name="cat" value="Future" id="future" onChange={(e)=>{setCat(e.target.value)}}/>
                    <label htmlFor="future">Future</label>
                </div>
            </div>
        </div>
    </form>
  )
}
