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
  
  return (
    <MuiButton 
        onClick={handleClick}
        variant="outline-primary"
        size="lg" 
        style={{ 
          width: '250px',
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
  )
}

export default ButtonLink;