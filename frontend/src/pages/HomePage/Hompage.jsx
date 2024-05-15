import React, {lazy, memo, Suspense, useEffect, useState} from "react";
import "./Homepage.scss";
import {getBanner} from "../../api/banner";
import Event from "../../components/eventComponet/Event";
import Category from "../../components/category/Category";
import Product from "../../components/product/Product";
import {useSelector} from "react-redux";
import {FiCheckCircle, FiRefreshCw} from "react-icons/fi";
import {LuTruck} from "react-icons/lu";
import {IoShieldOutline} from "react-icons/io5";
import Loading from "../../components/Loading/Loading";

const Blog = lazy(() => import("../../components/blog/Blog"));
const Slick = lazy(() => import("../../components/Slick/SlickBaner"));

function HomePage() {
    const [dataBanner, setDataBanner] = useState([]);
    const {data} = useSelector((state) => state.products);
    const {data: category} = useSelector((state) => state.category);
    const fetchbanner = async () => {
        const res = await getBanner();
        setDataBanner(res?.response);
    };

    useEffect(() => {
        fetchbanner();
    }, []);
    return (
        <div className="container">
            <div className="container--banner">
                <Suspense fallback={<Loading/>}>
                    <Slick data={dataBanner}/>
                </Suspense>
            </div>
            <div className="container--event">
                <Event/>
            </div>
            <div className="container--category">{category && <Category/>}</div>
            <div className="container--product">
                <div className="content">
                    <div className="container--product--item">
                        {category?.map((el) => {
                            const filteredData = data
                                ?.filter((item) => item?.category.name === el?.name)
                                .slice(0, 4);
                            if (filteredData?.length > 0) {
                                return (
                                    <Product key={el.id} category={el} data={filteredData}/>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
            <div className="container--blog">
                <div className="content-blog">
                    <Suspense fallback={<Loading/>}>
                        <Blog/>
                    </Suspense>
                </div>
            </div>
            <div className="container--video">
                <video autoPlay muted loop>
                    <source src={process.env.REACT_APP_CLOUDINARY_VIDEO_URL} type="video/mp4"/>
                </video>
            </div>
            <div className="container--des">
                <>
                    <div className="container--des--name">
                        <p style={{margin: 0, fontSize: "28px"}}>top</p>
                        <p style={{margin: 0, fontSize: "28px", color: "red"}}>Z</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#07A056", fontStyle: "oblique"}}>0</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#03AEF1", fontStyle: "oblique"}}>N</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#C3158CFF", fontStyle: "oblique"}}>E</p>
                    </div>
                    <p className="container--des--text">
                        <p>
                            Tại TopPhone, khách hàng yêu mến hệ sinh thái Apple sẽ tìm thấy
                            đầy đủ và đa dạng nhất các sản phẩm như
                        </p>
                        <p>
                            iPhone, iPad, Apple Watch, MacBook và các phụ kiện Apple... với
                            không gian mua sắm đẳng cấp, hiện đại.
                        </p>
                    </p>
                </>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <div className="content">
                    <div className="container--policy">
            <span>
              <FiCheckCircle size={32}/>
              <p>Mẫu mã đa dạng, chính hãng</p>
            </span>
                        <span>
              <LuTruck size={32}/>
              <p>Giao hàng toàn quốc</p>
            </span>{" "}
                        <span>
              <IoShieldOutline size={32}/>
              <p>Bảo hành có cam kết tới 12 tháng</p>
            </span>{" "}
                        <span>
              <FiRefreshCw size={32}/>
              <p>Có thể đổi trả tại</p>
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(HomePage);
