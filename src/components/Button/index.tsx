import type { JSX } from "react";
import { Button as MuiButton} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface ButtonLink {
    children: React.ReactNode;
    url: string;
}


function ButtonLink({children, url}: ButtonLink): JSX.Element {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url);
  };
  
  return (
    <MuiButton 
        onClick={handleClick}
        variant="outline-primary" 
        size="lg" 
        style={{ width: '250px' }} 
        className="fw-semibold"
    >
        {children}
    </MuiButton>
  )
}

export default ButtonLink;