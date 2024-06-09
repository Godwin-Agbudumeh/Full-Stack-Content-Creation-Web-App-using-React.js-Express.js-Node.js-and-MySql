import "./navbar.css";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
import humanAvatar from "../../images/humanAvatar.png"


export default function Navbar() {
  const [display, setDisplay] = useState(false);
  const [showsearch, setShowSearch] = useState(false);
  const [searchinput, setSearchinput] = useState(null);
  const PF = `${process.env.REACT_APP_IMAGE_LINK}`;

  const handleSlide = ()=>{
    setDisplay(!display);
  };

  const handleSearch = ()=>{
    setShowSearch(!showsearch);
  };

  const { currentUser, dispatch } = useContext(Context); 

  const handleLogout = async ()=>{
    const res = await axios.post(`${process.env.REACT_APP_API}/auth/logout`);
    console.log(res);
    dispatch({type:"LOGOUT"});
  }

  const handleSearchChange = (e)=>{
    setSearchinput(e.target.value);
  }

  return (
    <>
        <nav className="navbar">
            <div className="nav-left">
                <span className="site-title"><Link to="/" className="link">DevLyf</Link></span>
            </div>

            <div className="nav-center">
              <ul className="list">
                <li className="list-item"><Link to="/" className="link">Home</Link></li>
                <li className="list-item"><Link to="/write" className="link">Create Post</Link></li>
                <li className="list-item"><Link to="/" className="link">About</Link></li>
                <li className="list-item"><Link to="/" className="link">Posts</Link></li>
                <li className="list-item"><Link to="/" className="link">Contact</Link></li>
              </ul>
            </div>

            <div className="nav-right">
              <span className="search-icon" onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></span>
              {
                currentUser ? 
                  (<>
                      <Link to={`/profile/${currentUser?.id}`}>
                        {currentUser?.img ? (
                          <img src={PF + currentUser?.img} alt="" className="profile-image"/>
                          ):(
                            <img src={humanAvatar} alt="" className="profile-image"/>
                          )
                        }
                      </Link>
                      <span onClick={handleLogout} className="nav-logout">Logout</span>
                   </>
                  ) :
                  (<>
                    <span><Link to="/login" className="link">Login</Link></span>
                    <span><Link to="/register" className="link">Sign Up</Link></span>
                   </>
                  )
              }
            </div>

            {showsearch && (
              <div className="search-input">
                <input type="text" placeholder="Search here...." onChange={handleSearchChange}/>
                <Link to={`/?searchposts=${searchinput}`}><i className="search-button fa-solid fa-magnifying-glass" onClick={handleSearch}></i></Link>
              </div>     
            )}

            {display && (
              <div id="slide-menu">
                <ul className="mobile-list">
                  <li className="mobile-list-item"><Link to="/" className="link" onClick={handleSlide}>Home</Link></li>
                  <li className="mobile-list-item"><Link to="/write" className="link" onClick={handleSlide}>Create Post</Link></li>
                  <li className="mobile-list-item"><Link to="/" className="link" onClick={handleSlide}>About</Link></li>
                  <li className="mobile-list-item"><Link to="/" className="link" onClick={handleSlide}>Contact</Link></li>
                  <li className="mobile-list-item"><Link to="/" className="link" onClick={handleSlide}>Posts</Link></li>
                  <li className="mobile-list-item"><input type="text" placeholder="Search here...."/><Link to={`/?searchposts=${searchinput}`}><i className="fa-solid fa-magnifying-glass mobile-search-icon" onClick={handleSlide}></i></Link></li>
                </ul>
              </div>
            )}

            <div className="mobile-nav">
              {
                currentUser ? 
                  (<>
                      <Link to={`/profile/${currentUser?.id}`}><img src={PF + currentUser?.img} alt="" className="profile-image"/></Link>
                      <span onClick={handleLogout} className="nav-logout">Logout</span>
                   </>
                  ) :
                  (<>
                    <span><Link to="/login" className="link">Login</Link></span>
                    <span><Link to="/register" className="link">Sign Up</Link></span>
                   </>
                  )
              }
              <span className="mobile-menu" onClick={handleSlide}><i className="fa-solid fa-bars"></i></span>
            </div>
        </nav>
    </>
  )
}
