import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Button } from "@mui/material";

function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="NotFoundPage">
      <h1 className="title">404</h1>
      <p className="subtitle">Oops! Page not found</p>
      <Button
        className="goBack"
        variant={"contained"}
        color={"warning"}
        onClick={goBack}
      >
        Go Back
      </Button>
      <div className="ball ball1" />
      <div className="ball ball2" />
      <div className="ball ball3" />
      <div className="ball ball4" />
      <div className="ball ball5" />
      <div className="ball ball6" />
      <div className="ball ball7" />
    </div>
  );
}

export default NotFoundPage;
