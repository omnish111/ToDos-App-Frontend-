import { useNavigate } from "react-router-dom";

import Button from "./Button";

function Navbar({ userName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="brand-block">
        <h1>To-Do App</h1>
      </div>
      <div className="nav-actions">
        <p className="welcome-text">Hi, {userName}</p>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
