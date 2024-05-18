import React, { useEffect, useState } from "react";
import "./Order.scss";
import { cancleOrderUser, getOrderUser } from "../../api/order";
import { useSelector } from "react-redux";
import { formatNumber } from "../../helper/format";
import { toast } from "react-toastify";

function Order() {
    const { user } = useSelector((state) => state.user);
    const [dataOrder, setDataOrder] = useState([]);

    const fetchDataOrder = async () => {
        try {
            const res = await getOrderUser(user._id);
            if (res.success) {
                setDataOrder(res.response);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleCancleOrder = async (data) => {
        try {
            const res = await cancleOrderUser(data._id);
            if (res.success) {
                toast.success("Hủy đơn hàng thành công");
                fetchDataOrder();
            }
        } catch (error) {
            console.error("Error occurred while canceling order:", error);
        }
    };

    useEffect(() => {
        fetchDataOrder();
    }, [user]);

    return (
        <div className="order">
            <div className="content-order-history">
                {dataOrder.length === 0 ? (
                    <div>
                        <h1>Bạn chưa có đơn hàng nào</h1>
                        <img style={{marginBottom: "10px", borderRadius: "8px"}} src={require('../../styles/image/cart-item-nothing.png')} alt="Hình ảnh san phẩm"/>
                    </div>
                ) : (
                    dataOrder.map((el) => (
                        <div className="order--list" key={el._id}>
                            <div className="order--list--item image">
                                <img style={{ width: "100px", height: "100px" }} src={el?.products[0]?.product?.image[0].url} alt="Hình ảnh sản phẩm" />
                            </div>
                            <div style={{ fontWeight: "600" }} className="order--list--item">
                                <p>Màu: {el?.products[0].color}</p>
                            </div>
                            <div className="order--list--item">
                                <h4>Số lượng: {el?.products[0].quantity}</h4>
                            </div>
                            <div className="order--list--item">
                                <h4><span style={{ fontWeight: "600" }}>Tình trạng thanh toán:</span> {el?.payments === "cod" && el?.status !== "Đã giao" ? "Chưa thanh toán" : "Đã thanh toán"}</h4>
                            </div>
                            <div className="order--list--item">
                                <h4><span style={{ fontWeight: "600" }}>Giá:</span>{formatNumber(el?.totalPrice)}</h4>
                            </div>
                            <div className="order--list--item">
                                <h4>{el?.status}</h4>
                            </div>
                            <div className="order--list--item action">
                                <h4>Hành động: </h4>
                                {el?.status === "Chờ xử lý" && el?.payments !== "online" && (
                                    <button onClick={() => handleCancleOrder(el)} className="btn">Hủy</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Order;
