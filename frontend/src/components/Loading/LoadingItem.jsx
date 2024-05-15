import React from "react";
import "./Loading.scss";

function LoadingItem({isLoading, children}) {
    if (!isLoading) {
        return (
            <div style={{width: "100%"}}>
                {children && <div style={{width: "100%"}}>{children}</div>}
            </div>
        );
    } else {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }
}

export default LoadingItem;
