import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Empower Growth Through Meaningful Feedback</h2>
        <p>
          Our platform bridges the gap between managers and employees, enabling
          constructive communication that drives personal and professional
          development.
        </p>
        <button onClick={() => navigate("/dashboard")}>Let's try</button>
      </div>
    </div>
  );
}
export default Home;
