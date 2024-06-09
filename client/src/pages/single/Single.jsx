import Singlepost from "../../components/singlepost/Singlepost";
import Sidebar from "../../components/sidebar/Sidebar";
import "./single.css";

export default function Single() {
  return (
    <div className="single">
        <Singlepost />
        <Sidebar />
    </div>
  )
}
