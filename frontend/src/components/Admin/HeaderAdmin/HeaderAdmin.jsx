import React, { memo, useEffect, useState } from "react";
import "./HeaderAdmin.scss";
import { useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import Logo from "../../../styles/image/Logo.png";
import withBase from "../../../hocs/withBase";

function HeaderAdmin({ navigate }) {
    const { user } = useSelector((state) => state.user);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

    useEffect(() => {
        if (user) {
            setProfilePicture(user.profilePicture);
        }
    }, [user]);

    return (
        <div className="header-ad">
            <div
                className="header-ad--left"
                onClick={() => {
                    navigate("/");
                }}
            >
                <p style={{ margin: 0, fontSize: "28px" }}>top</p>
                <p style={{ margin: 0, fontSize: "28px", color: "red" }}>Z</p>
                <p style={{ margin: 0, fontSize: "28px", color: "#07A056", fontStyle: "oblique" }}>0</p>
                <p style={{ margin: 0, fontSize: "28px", color: "#03AEF1", fontStyle: "oblique" }}>N</p>
                <p style={{ margin: 0, fontSize: "28px", color: "#C3158CFF", fontStyle: "oblique" }}>E</p>
                <img src={Logo} className="right--image" alt="Logo" />
            </div>
            <div className="header-ad--right">
                <div className="header-ad--right--image">
                    {profilePicture ? (
                        <img
                            src={profilePicture}
                            alt={`${user?.name}'s avatar`}
                            className="user-avatar"
                        />
                    ) : (
                        <FaRegUser size={20} />
                    )}
                </div>
                <p style={{ fontWeight: "600" }}>{user?.name}</p>
            </div>
        </div>
    );
}

export default withBase(memo(HeaderAdmin));
