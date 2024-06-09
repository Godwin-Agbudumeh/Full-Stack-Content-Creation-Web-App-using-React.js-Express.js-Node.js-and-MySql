import "./sidebar.css";
import { Link }from "react-router-dom"
import Pic4 from "../../images/Pic4.png";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
          <span className="sidebar-title">About DevLyf</span>
          <img src={Pic4} alt="" />
          <p>
              To encourage absolute beginners and professionals to share their knowledge. 
          </p>
      </div>
      <div className="sidebar-item">
          <span className="sidebar-title">CATEGORIES</span>
          <ul className="sidebar-list">
            <li className="sidebar-list-item"><Link to={"/?cat=Frontend"}>Frontend</Link></li>
            <li className="sidebar-list-item"><Link to={"/?cat=Backend"}>Backend</Link></li>
            <li className="sidebar-list-item"><Link to={"/?cat=Technology"}>Technology</Link></li>
            <li className="sidebar-list-item"><Link to={"/?cat=Programming"}>Programming</Link></li>
            <li className="sidebar-list-item"><Link to={"/?cat=General"}>General</Link></li>
            <li className="sidebar-list-item"><Link to={"/?cat=Future"}>Future</Link></li>
          </ul>      
      </div>
      <div className="sidebar-item">
          <span className="sidebar-title">FOLLOW US</span>
          <div className="sidebar-social">
              <i className="sidebar-icon fa-brands fa-square-facebook"></i>
              <i className="sidebar-icon fa-brands fa-square-twitter"></i>
              <i className="sidebar-icon fa-brands fa-square-pinterest"></i>
              <i className="sidebar-icon fa-brands fa-square-instagram"></i>
          </div>
      </div>
    </div>
  )
}
