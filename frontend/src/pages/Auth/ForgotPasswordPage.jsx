import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as UserService from '../../api/user';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = async (data) => {
        try {
            const res = await UserService.forgotPassword(data);
            if (res.success) {
                toast.success(res.mes);
                setEmailSent(true);
            }
        } catch (error) {
            toast.error(error.response.data.mes);
        }
    };

    return (
        <div className="forgot-password">
            <h1>Quên mật khẩu</h1>
            {!emailSent ? (
                <form style={{width: "300px"}} onSubmit={handleSubmit(onSubmit)}>
                    <div style={{width: "300px"}}>
                        <label htmlFor="email">Email:</label>
                        <input
                            style={{width: "280px", display: "inline-block"}}
                            type="email"
                            id="email"
                            {...register('email', { required: true })}
                        />
                        {errors.email && <span className="error-message">Vui lòng nhập email</span>}
                    </div>
                    <button type="submit">Gửi email</button>
                </form>
            ) : (
                <p>Email yêu cầu thay đổi mật khẩu đã được gửi!</p>
            )}
        </div>
    );
};

export default ForgotPasswordPage;