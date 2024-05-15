import React, {useEffect, useState} from "react";
import "./Dashbord.scss";
import {getOrders} from "../../../api/order";
import PeiChard from "./Chart/PeiChard";

function Dashboard() {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        try {
            const res = await getOrders();

            if (res.success) {
                const processedData = res.response.map((item) => ({
                    id: item._id,
                    name: item.user.name,
                    phone: item.user.phone,
                    price: item.totalPrice,
                    status: item.status,
                    product: item.product,
                }));
                setData(processedData);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <div className="chart-container">
                <div className="chart-title">
                    Biểu Đồ Thống Kê Trạng Thái Đơn Hàng
                </div>
                <PeiChard name="Biểu đồ trạng thái đơn hàng" data={data}/>
            </div>
        </div>
    );
}

export default Dashboard;
