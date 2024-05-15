import React from "react";
import "./Sidebar.scss";
import {IoMdClose} from "react-icons/io";

function Sidebar({children, setListMenuRp}) {
    return (
        <div className="sidebarMN" onClick={() => setListMenuRp(false)}>
            <div className="sidebarMN--list" onClick={(e) => e.stopPropagation()}>
                <div className="sidebarMN--list--close">
          <span onClick={() => setListMenuRp(false)}>
            <IoMdClose size={24}/>
          </span>
                </div>
                <div className="sidebarMN--list--children">{children}</div>
            </div>
        </div>
    );
}

export default Sidebar;
