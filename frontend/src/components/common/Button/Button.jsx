import React from "react";
import "./Button.scss";

function Button(props) {
    const {type, children} = props;
    return (
        <button type={type} className="button">
            {children}
        </button>
    );
}

export default Button;
