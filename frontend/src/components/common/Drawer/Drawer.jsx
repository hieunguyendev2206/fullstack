import React, {memo} from "react";
import "./Drawer.scss";
import {IoMdClose} from "react-icons/io";

function DrawerCpn({children, isOpen, setisOpen}) {
    return isOpen ? (
        <div className="drawer">
            <div className="drawer--content right-to-left-animation">
                <div className="drawer--content--icon" onClick={() => setisOpen(false)}>
                    <IoMdClose size={26}/>
                </div>
                <div className="drawer--content--children">{children}</div>
            </div>
        </div>
    ) : null;
}

export default memo(DrawerCpn);
