import React from "react";
import "./Fotter.scss";
import Logo from "../../styles/image/Logo.png";
import {FaFacebookF, FaYoutube} from "react-icons/fa";
import {SiZalo} from "react-icons/si";
import image1 from "../../styles/image/certify-bct.png";
import image2 from "../../styles/image/_dmca_premi_badge_4.png";
import image3 from "../../styles/image/handle_cert.png";

export default function Footter() {
    return (
        <div className="footer">
            <div className="content-footer">
                <div className="footer--top">
                    <div className="footer--top--name">
                        <p style={{margin: 0, fontSize: "28px"}}>top</p>
                        <p style={{margin: 0, fontSize: "28px", color: "red"}}>Z</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#07A056", fontStyle: "oblique"}}>0</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#03AEF1", fontStyle: "oblique"}}>N</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#C3158CFF", fontStyle: "oblique"}}>E</p>
                    </div>
                    <div className="footer--top--logo">
                        <img src={Logo} className="right--image" alt=""/>
                    </div>
                </div>
                <div className="footer--center">
                    <div className="footer--center--column">
                        <p className="name">Tổng đài</p>
                        <p className="point">Mua hàng: 1900.9696.42 (7:30 - 22:00)</p>
                        <p className="point">Khiếu nại: 1900.9868.43 (8:00 - 21:30)</p>
                        <p style={{color: "#ccc"}}>Kết nối với chúng tôi</p>
                        <div className="footer--center--column--listIcon">
                            <div className="footer--center--column--listIcon--item">
                                <FaFacebookF className="footer--center--column--listIcon--item--icon"/>
                            </div>
                            <div className="footer--center--column--listIcon--item">
                                <FaYoutube className="footer--center--column--listIcon--item--icon"/>
                            </div>
                            <div className="footer--center--column--listIcon--item">
                                <SiZalo className="footer--center--column--listIcon--item--icon"/>
                            </div>
                        </div>
                    </div>
                    <div className="footer--center--column">
                        <p className="name">Hệ thống cửa hàng</p>
                        <p className="point">Xem 97 cửa hàng</p>
                        <p className="point">Nội quy cửa hàng</p>
                        <p className="point">Chất lượng phục vụ</p>
                        <p className="point">Chính sách bảo hành & đổi trả</p>
                    </div>
                    <div className="footer--center--column">
                        <p className="name">Hỗ trợ khách hàng</p>
                        <p className="point"> Điều kiện giao dịch chung</p>
                        <p className="point">Hướng dẫn mua hàng online</p>
                        <p className="point">Chính sách giao hàng</p>
                        <p className="point">Hướng dẫn thanh toán</p>
                    </div>
                    <div className="footer--center--column">
                        <p className="name"> Trung tâm bảo hành TopCare</p>
                        <p className="point">Giới thiệu TopCare</p>
                    </div>
                </div>
                <div className="footer--bottom">
                    <div className="footer--bottom--left">
                        <p>
                            © 2024. Công ty cổ phần TopZone. GPDKKD: 0303217354 do sở KH & ĐT
                            TP.HCM
                        </p>
                        <p>
                            © 2024. Công ty cổ phần TopZone. GPDKKD: 0303217354 do sở KH & ĐT
                            TP.HCM
                        </p>
                        <p>
                            Địa chỉ: 128 Trần Quang Khải, P.Tân Định, Q.1, TP. Hồ Chí Minh.
                            Điện thoại: 028 38125960.
                        </p>
                        <p>
                            Chịu trách nhiệm nội dung: Nguyễn Đức Hiệu.
                            Email:hieunguyendev2206@gmail.com.
                        </p>
                    </div>
                    <div className="footer--bottom--right">
            <span>
              <img src={image1} alt=""/>
            </span>
                        <span>
              <img src={image3} alt=""/>
            </span>
                        <span>
              <img src={image2} alt=""/>
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
