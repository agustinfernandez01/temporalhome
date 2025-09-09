import "./index.css";
import {Route,Routes} from  "react-router-dom";

/* Views */
import Dashboard from "../public/Views/Dashboard";
import Login from "../public/Views/Login";
/* Views */

export default function App() {


  return (
    <>
      <Routes>
        {/* Admin */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Cliente */}
        <Route path="/profile" element={<div className="p-4">Profile Page</div>} />
      </Routes>
    </>
  );
}
