import React from "react";
import "./Sidebar.scss";
import {sidebar} from "../../../static/Admin";

function SideBar({active, setActive}) {
    return (
        <div className="sidebar">
            {sidebar.map((el, index) => (
                <div style={{paddingLeft: '10px', paddingTop: '10px'}}
                    className={`sidebar--list ${active === index + 1 && "active"}`}
                    key={el.id}
                    onClick={() => setActive(index + 1)}
                >
                    <el.icon className="sidebar--list--icon"/>
                    <p className="sidebar--list--name">{el.name}</p>
                </div>
            ))}
        </div>
    );
}

export default SideBar;
