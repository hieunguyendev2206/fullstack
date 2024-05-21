import React from "react";
import Header from "./HeaderAdmin/HeaderAdmin";

function LayoutAdmin({children}) {
    return (
        <div>
            <Header/>
            {children}
        </div>
    );
}

export default LayoutAdmin;
