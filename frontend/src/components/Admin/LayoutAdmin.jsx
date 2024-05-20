import React from "react";
import Header from "./header/Header";

function LayoutAdmin({children}) {
    return (
        <div>
            <Header/>
            {children}
        </div>
    );
}

export default LayoutAdmin;
