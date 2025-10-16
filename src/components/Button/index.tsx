import { useState, type JSX } from "react";
import { Button as MuiButton} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface ButtonLink {
    children: React.ReactNode;
    url: string;
}


function ButtonLink({children, url}: ButtonLink): JSX.Element {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url);
  };

  const MAX_WIDTH = '280px';
  
  return (
    <div className="d-grid mx-auto w-100" style={{ maxWidth: MAX_WIDTH }}>
      <MuiButton 
        onClick={handleClick}
        variant="outline-primary"
        size="lg" 
        style={{ 
          borderColor: "#Ec3239",
          color: isHover ? "white" : "#Ec3239",
          backgroundColor: isHover ? "#Ec3239" : "white",
          transition: "all 0.2s ease",
        }} 
          className="fw-semibold"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
        {children}
      </MuiButton>
    </div>
  )
}

export default ButtonLink;