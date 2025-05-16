import React from "react";
import "./Button.css";

interface ButtonProps {
  name: string;
  orange?: boolean;
  wide?: boolean;
  clickHandler: (buttonName: string) => void;
  "data-test"?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  name, 
  orange = false, 
  wide = false, 
  clickHandler,
  "data-test": dataTest 
}) => {
  const handleClick = () => {
    clickHandler(name);
  };

  const className = [
    "component-button",
    orange ? "orange" : "",
    wide ? "wide" : "",
  ].join(" ").trim();

  return (
    <div className={className}>
      <button onClick={handleClick} data-test={dataTest}>{name}</button>
    </div>
  );
};

export default Button; 