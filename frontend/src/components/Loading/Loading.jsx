import React from "react";
import "./Loading.scss";

function Loading({children}) {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            {children && <div className="loading-content">{children}</div>}
        </div>
    );
}

export default Loading;
