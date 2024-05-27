import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../api/user";
import './UserDetail.scss';
import defaultCoverPicture from '../../styles/image/default-cover.png';
import defaultProfilePicture from '../../styles/image/default-user.webp';

function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id);
                console.log("API response:", res);
                if (res.success) {
                    setUser(res.user);
                } else {
                    console.error("Failed to fetch user data:", res.message);
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        fetchUser();
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className='personal'>
            <div className='cover-container'>
                <img src={user.coverPicture || defaultCoverPicture} alt="Cover" className='cover-picture' />
            </div>
            <div className='content-personal'>
                <div className='personal--box'>
                    <div className='personal--box--top'>
                        <span style={{ backgroundImage: `url(${user.profilePicture || defaultProfilePicture})` }} className='profile-picture'>
                            {!user.profilePicture }
                        </span>
                    </div>
                    <div className='personal--box--bottom'>
                        <span>
                            <label htmlFor=''>Tên: </label>
                            <input value={user.name} disabled />
                        </span>
                        <span>
                            <label htmlFor=''>Số điện thoại: </label>
                            <input value={user.phone} disabled />
                        </span>
                        <span>
                            <label htmlFor=''>Địa chỉ: </label>
                            <input value={user.address} disabled />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDetail;
