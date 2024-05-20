import React from "react";
import Header from "./header/Header";
import HeaderAdmin from "./HeaderAdmin/HeaderAdmin";

function LayoutAdmin({children}) {
    return (
        <div>
            <HeaderAdmin/>
            {children}
        </div>
    );
}

export default LayoutAdmin;
