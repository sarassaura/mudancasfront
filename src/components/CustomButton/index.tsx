import { type JSX, useState, type ReactNode } from "react";
import { Button } from "react-bootstrap";
import type { ButtonProps } from "react-bootstrap/Button";

interface CustomButtonProps extends ButtonProps {
    children: ReactNode;
    isOutline?: boolean; 
}

const RED_COLOR = '#Ec3239';
const HOVER_DARKER_COLOR = '#C62A30';

function CustomButton({ children, isOutline = false, ...props }: CustomButtonProps): JSX.Element {
    const [isHover, setIsHover] = useState(false);

    const outlineStyle = {
        borderColor: RED_COLOR,
        backgroundColor: isHover ? RED_COLOR : 'white',
        color: isHover ? 'white' : RED_COLOR,
    };

    const solidStyle = {
        backgroundColor: isHover ? HOVER_DARKER_COLOR : RED_COLOR,
        borderColor: RED_COLOR,
        color: 'white',
    };

    return (
        <Button
            size="lg"
            {...props}
            style={{ 
                width: "200px", 
                ...(isOutline ? outlineStyle : solidStyle) 
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {children}
        </Button>
    );
}

export default CustomButton;