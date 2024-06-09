import  "./footer.css";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";

export default function Footer() {
  return (
    <div className="footer">
        <span className="site-title"><Link to="/">DevLyf</Link></span>
        <span>Designed by DevLyf. Copyright 2024. All rights reserved.</span>
    </div>
  )
}
