import React, {memo, useEffect, useState} from "react";
import "./Auth.scss";
import Button from "../../components/common/Button/Button";
import {useForm} from "react-hook-form";
import withBase from "../../hocs/withBase";
import * as UserService from "../../api/user";
import Cookies from "js-cookie";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

function Auth({navigate}) {
    const {user} = useSelector((state) => state.user);
    const {
        register,
        formState: {errors},
        handleSubmit,
        reset,
    } = useForm();
    const [form, setForm] = useState(1);

    const onSubmit = async (data) => {
        try {
            if (form === 1) {
                const url = sessionStorage.getItem("url");
                const res = await UserService.login(data);
                if (res?.success) {
                    Cookies.set("accesstoken", res.token);
                    if (url) {
                        navigate(url);
                        sessionStorage.removeItem("url");
                    } else {
                        navigate("/");
                    }
                    reset();
                }
            } else if (form === 2) {
                const res = await UserService.register(data);
                if (res?.success) {
                    toast.success("Email xác thực đã được gửi đến bạn");
                    setForm(1);
                    reset();
                }
            }
        } catch (e) {
            toast.error(e?.response?.data?.mes);
            console.log(e);
        }
    };
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);
    return (
        <div className="auth">
            <div className="auth--left">
                {form === 1 && (
                    <div className="auth--left--login">
                        <h1>Chào mừng bạn đến với trang đăng nhập của chúng tôi</h1>
                        <p>
                            Hãy đăng nhập để trải nghiệm tốt nhất từ dịch vụ của chúng tôi.
                        </p>
                    </div>
                )}
                {form === 2 && (
                    <div className="auth--left--login">
                        <h1>Chào mừng bạn đến với trang đăng ký của chúng tôi</h1>
                        <p>
                            Hãy đăng đăng ký cho mình một tài khoản để trải nghiệm tốt nhất từ
                            dịch vụ tốt nhất từ chúng tôi.
                        </p>
                    </div>
                )}
            </div>
            <div className="auth--right">
                {form === 1 && (
                    <div className="auth--right--login">
                        <h1>Đăng nhập</h1>
                        <form
                            className="auth--right--login--form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="auth--right--login--form--item">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Hãy nhập email của bạn"
                                    {...register("email", {required: true})}
                                />
                                {errors.email && (
                                    <span className="error-message">Vui lòng nhập email</span>
                                )}
                            </div>
                            <div className="auth--right--login--form--item">
                                <label htmlFor="password">Mật khẩu:</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Hãy nhập mật khẩu của bạn"
                                    {...register("password", {required: true})}
                                />
                                {errors.password && (
                                    <span className="error-message">Vui lòng nhập mật khẩu</span>
                                )}
                            </div>
                            <div className="auth--right--login--form--submit">
                                <Button type="submit">Đăng nhập</Button>
                            </div>
                        </form>
                        <p onClick={() => setForm(2)}>Bạn chưa có tài khoản?</p>
                        <p onClick={() => navigate("/")}>Trang chủ</p>
                    </div>
                )}
                {form === 2 && (
                    <div className="auth--right--login">
                        <h1>Đăng ký</h1>
                        <form
                            className="auth--right--login--form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="auth--right--login--form--item">
                                <label htmlFor="name">Họ và tên:</label>
                                <input
                                    type="name"
                                    id="name"
                                    placeholder="Hãy nhập tên của bạn"
                                    {...register("name", {required: true})}
                                />
                                {errors.name && (
                                    <span className="error-message">Vui lòng nhập tên</span>
                                )}
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Hãy nhập email của bạn"
                                    {...register("email", {required: true})}
                                />
                                {errors.email && (
                                    <span className="error-message">Vui lòng nhập email</span>
                                )}
                            </div>
                            <div className="auth--right--login--form--item">
                                <label htmlFor="password">Mật khẩu:</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Hãy nhập mật khẩu của bạn"
                                    {...register("password", {required: true})}
                                />
                                {errors.password && (
                                    <span className="error-message">Vui lòng nhập mật khẩu</span>
                                )}
                            </div>
                            <div className="auth--right--login--form--submit">
                                <Button type="submit">Đăng ký</Button>
                            </div>
                        </form>
                        <p onClick={() => setForm(1)}>Bạn đã có tài khoản?</p>
                        <p onClick={() => navigate("/")}>Trang chủ</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default withBase(memo(Auth));
