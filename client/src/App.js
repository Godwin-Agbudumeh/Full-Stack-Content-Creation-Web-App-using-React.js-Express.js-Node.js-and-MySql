import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Write from "./pages/write/Write";
import Single from "./pages/single/Single";
import Profile from "./pages/profile/Profile";
import Editprofile from "./pages/editprofile/Editprofile";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword"
import  ResetPassword from "./pages/resetPassword/ResetPassword"
import  Admin from "./pages/admin/Admin"
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;

  const { currentUser } = useContext(Context); 

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={currentUser ? <Home /> : <Login />} />
        <Route path="/register" element={currentUser ? <Home /> : <Register />} />
        <Route path="/write" element={currentUser ? <Write /> : <Login />} />
        <Route path="/post/:postId" element={<Single />} />
        <Route path="/profile/:profileId" element={<Profile />} />
        <Route path="/editProfile" element={currentUser ? <Editprofile /> : <Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/admin" element={currentUser?.role === "ADMIN" ? <Admin /> : <Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
