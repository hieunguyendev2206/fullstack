import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyEmail } from '../../api/user';
import emailActiveImage from '../../styles/image/verify_success.png';
import emailNotActiveImage from '../../styles/image/verify_failed.png';

const VerifyEmailPage = () => {
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        console.log("Token from URL:", token);
        if (token) {
            verifyEmail(token).then((response) => {
                console.log("Response from verifyEmail:", response);
                if (response.success) {
                    setMessage('Xác thực thành công!');
                    setVerified(true);
                } else {
                    setMessage(response.mes);
                    setVerified(false);
                }
            }).catch((error) => {
                console.error("Error from verifyEmail:", error);
                setMessage('Liên kết xác thực không hợp lệ hoặc đã hết hạn!');
                setVerified(false);
            });
        }
    }, [location]);

    return (
        <div className="content-verified-email">
            <h1>{message}</h1>
            {verified !== null && (
                <img
                    src={verified ? emailActiveImage : emailNotActiveImage}
                    alt={verified ? 'Email Verified' : 'Email Not Verified'}
                    style={{ width: '300px', height: '300px', textAlign: "center", borderRadius: "10px" }}
                />
            )}
        </div>
    );
};

export default VerifyEmailPage;
