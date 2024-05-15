import React, {useState} from "react";
import SideBar from "../sidebar/SideBar";
import AdminItem from "../AdminItem/AminItem";
import "./AdminContent.scss";

function AdminContent() {
    const [active, setActive] = useState(1);
    return (
        <div className="AdminCT">
            <div className="AdminCT--left">
                <SideBar cl active={active} setActive={setActive}/>
            </div>
            <div className="AdminCT--right">
                <AdminItem active={active} setActive={setActive}/>
            </div>
        </div>
    );
}

export default AdminContent;
