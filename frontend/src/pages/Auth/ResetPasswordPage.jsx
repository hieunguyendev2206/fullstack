import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../api/user';
import { toast } from 'react-toastify';
import expiredLinkImage from '../../styles/image/verify_failed.png';
import passwordChangedImage from '../../styles/image/verify_success.png';

const ResetPasswordPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [validLink, setValidLink] = useState(true);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get('token');
        setToken(token);

        // Kiểm tra tính hợp lệ của liên kết
        UserService.verifyResetToken(token).then((response) => {
            if (!response.success) {
                setValidLink(false);
                setStatus('expired');
                toast.error(response.mes);
            }
        }).catch((error) => {
            setValidLink(false);
            setStatus('expired');
            toast.error(error.mes);
        });
    }, [location]);

    const onSubmit = async (data) => {
        try {
            const res = await UserService.resetPassword(token, data);
            if (res.success) {
                toast.success(res.mes);
                setStatus('passwordChanged');
                navigate('/auth');
            }
        } catch (error) {
            toast.error(error.mes);
        }
    };

    const getImage = () => {
        switch (status) {
            case 'expired':
                return expiredLinkImage;
            case 'passwordChanged':
                return passwordChangedImage;
            default:
                return null;
        }
    };

    return (
        <div className="reset-password">
            <h1>Đổi mật khẩu</h1>
            {validLink ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="password">Mật khẩu mới:</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password', { required: true })}
                        />
                        {errors.password && <span className="error-message">Vui lòng nhập mật khẩu</span>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword', {
                                required: true,
                                validate: (value) => value === watch('password') || 'Mật khẩu không khớp'
                            })}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                    </div>
                    <button type="submit">Đổi mật khẩu</button>
                </form>
            ) : (
                <div className="link-expired">
                    <h4 style={{textAlign: "center"}}>Liên kết đã hết hạn hoặc không hợp lệ!</h4>
                    {getImage() && (
                        <img
                            src={getImage()}
                            alt={status}
                            style={{ width: '300px', height: '300px', textAlign: "center", borderRadius: "10px" }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;
