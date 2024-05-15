import React, { memo, useEffect, useState } from "react";
import "./Payment.scss";
import { useSelector } from "react-redux";
import { formatNumber } from "../../helper/format";
import withBase from "../../hocs/withBase";
import { clearCart, decrease, getCartUser, increase } from "../../redux/slice/cartSlice";
import Swal from "sweetalert2";
import { createOrder } from "../../api/order";
import { toast } from "react-toastify";
import { removeCart } from "../../api/user";
import { Link, useLocation } from "react-router-dom";
import { createOrderVNpay, returnPayment } from "../../api/vnpay";

function Payment({ dispatch, navigate }) {
    const { pathname, search } = useLocation();
    const { data } = useSelector((state) => state.car);
    const { user } = useSelector((state) => state.user);
    const [choosePayment, setChoosePayment] = useState("cod");

    const handleDecrease = (data) => {
        dispatch(decrease(data));
    };

    const handleIncrease = (data) => {
        dispatch(increase(data));
    };

    const handleDeleteCard = async (data) => {
        try {
            const res = await removeCart(user._id, { _id: data._id });
            dispatch(getCartUser(res?.user.cart));
        } catch (e) {
            console.error(e);
        }
    };

    const totalPrice = data?.reduce((acc, cur) => acc + cur?.product?.price * cur?.quantity, 0);

    const handleOrder = async () => {
        // Kiểm tra người dùng đã đăng nhập hay chưa
        if (!user) {
            Swal.fire({
                title: "Bạn phải đăng nhập trước khi thanh toán",
                showCancelButton: true,
                confirmButtonText: "Đăng nhập",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigate("/auth");
                }
            });
            return;
        }

        // Kiểm tra thông tin người dùng đã đầy đủ chưa
        if (!user?.name || !user?.phone || !user?.address) {
            Swal.fire({
                title: "Bạn phải cập nhật thông tin trước khi thanh toán?",
                showCancelButton: true,
                confirmButtonText: "Cập nhật",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem("urlPayment", pathname);
                    navigate("/user");
                }
            });
            return;
        }

        // Kiểm tra giỏ hàng có sản phẩm nào không
        if (!data || data.length === 0) {
            toast.error("Bạn phải thêm sản phẩm vào giỏ hàng trước khi đặt hàng.");
            return;
        }

        const valuePayment = sessionStorage.getItem("payments") || choosePayment;
        const dataSend = {
            user: user,
            products: data?.map((el) => ({
                product: el?.product?._id,
                quantity: el?.quantity,
                color: el?.color,
            })),
            totalPrice: totalPrice,
            payments: valuePayment,
        };

        try {
            if (valuePayment === "online") {
                const response = await createOrderVNpay({ amount: totalPrice });
                if (response.success) {
                    window.location.href = response.paymentUrl;
                }
            } else {
                const response = await createOrder(dataSend);
                if (response.success) {
                    toast.success("Đặt hàng thành công!");
                    navigate("/");
                    sessionStorage.removeItem("payments");
                    dispatch(clearCart());
                    Swal.fire({
                        title: "Đơn hàng của bạn đã được đặt!",
                        text: "Cảm ơn bạn đã mua hàng.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        navigate("/order");
                    });
                }
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra khi đặt hàng.");
            console.error(e);
        }
    };

    const handleEdit = () => {
        sessionStorage.setItem("urlPayment", pathname);
        navigate("/user");
    };

    const handleChoosePayment = (e) => {
        setChoosePayment(e.target.value);
        sessionStorage.setItem("payments", e.target.value);
    };

    const fetchReturn = async () => {
        try {
            const response = await returnPayment(search);
            if (response?.RspCode === "00") {  // Thanh toán thành công
                toast.success("Thanh toán thành công, đơn hàng của bạn đã được đặt!");
                const dataSend = {
                    user: user,
                    products: data?.map((el) => ({
                        product: el?.product?._id,
                        quantity: el?.quantity,
                        color: el?.color,
                    })),
                    totalPrice: totalPrice,
                    payments: "online",  // Đánh dấu là thanh toán online
                };
                // Gọi hàm tạo đơn hàng với thông tin đã thanh toán
                const orderResponse = await createOrder(dataSend);
                if (orderResponse.success) {
                    dispatch(clearCart());
                    sessionStorage.removeItem("payments");
                    Swal.fire({
                        title: "Thanh toán thành công!",
                        text: "Đơn hàng của bạn đã được xử lý.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(() => {
                        navigate("/order");
                    });
                } else {
                    toast.error("Có lỗi xảy ra khi xử lý đơn hàng.");
                }
            } else {
                toast.error("Thanh toán thất bại, vui lòng thử lại.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
        }
    };

    useEffect(() => {
        if (search) {
            fetchReturn();
        }
    }, [search]);

    return (
        <div className="payment">
            <div className="payment-box">
                <div className="payment-box--top">
                    <span className="point">
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Link to="/">
                                <p>Về trang chủ</p>
                            </Link>
                        </div>
                    </span>
                    <p>Giỏ hàng của bạn</p>
                </div>
                <div className="payment-box--center">
                    {data?.map((el) => {
                        return (
                            <div className="payment-box--center--box" key={el?.product?._id}>
                                <div className="payment-box--center--box--left">
                                    <img src={el?.product?.image[0]?.url} alt="" />
                                </div>
                                <div className="payment-box--center--box--center">
                                    <h3>{el?.product?.name}</h3>
                                    <p>Màu: {el?.color}</p>
                                    <h4>{formatNumber(el?.product?.price)}</h4>
                                </div>
                                <div className="payment-box--center--box--right">
                                    <button
                                        disabled={el.quantity <= 1}
                                        onClick={() => handleDecrease(el)}
                                    >
                                        -
                                    </button>
                                    <p>{el?.quantity}</p>
                                    <button
                                        disabled={el.quantity >= el.totalquantity}
                                        onClick={() => handleIncrease(el)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="payment-box--center--box--delete">
                                    <button
                                        disabled={data?.length === 0}
                                        onClick={() => handleDeleteCard(el)}
                                        className="btn"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="payment-box--user">
                    <span>
                        <p>Tên khách hàng</p>
                        <input readOnly type="text" defaultValue={user?.name} />
                    </span>
                    <span>
                        <p>Số điện thoại</p>
                        <input readOnly type="text" defaultValue={user?.phone} />
                    </span>
                    <span>
                        <p>Địa chỉ</p>
                        <input readOnly type="text" defaultValue={user?.address} />
                    </span>
                    <span style={{ display: "flex", justifyContent: "end" }}>
                        <p
                            className="point"
                            style={{ color: "red", fontWeight: "500" }}
                            onClick={handleEdit}
                        >
                            Chỉnh sửa
                        </p>
                    </span>
                </div>
                <div className="payment-box--choose">
                    <select
                        name=""
                        id=""
                        defaultValue="cod"
                        onChange={handleChoosePayment}
                    >
                        <option value="cod">Thanh toán khi nhận hàng</option>
                        <option value="online">Thanh toán Online VNPAY</option>
                    </select>
                </div>
                <div className="payment-box--order">
                    <div className="payment-box--order--box">
                        <p>Tổng tiền</p>
                        <p>{formatNumber(totalPrice || 0)}</p>
                    </div>

                    <div disabled className="payment-box--order--pay">
                        <button
                            // disabled={data?.length === 0}
                            onClick={handleOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withBase(memo(Payment));
