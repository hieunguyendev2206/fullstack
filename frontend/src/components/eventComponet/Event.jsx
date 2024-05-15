import React, { lazy, Suspense, useState, useEffect } from "react";
import "./Event.scss";
import saleImage from "../../styles/image/icon-fs.png";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loading";

const SlickEvent = lazy(() => import("../Slick/SlickEvent"));

function Event() {
    const { data } = useSelector((state) => state.products);
    const dataEvent = data ? data.filter((el) => el?.discount > 0) : [];
    const [timeLeft, setTimeLeft] = useState(null);
    const endTime = new Date('May 22, 2024 08:45:00').getTime();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${days} Ngày ${hours} Giờ ${minutes} Phút ${seconds} Giây`);

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft("EXPIRED");
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return !data || data?.length < 3 ? null : (
        <div className="content-event">
            <div className="event-container">
                <div className="event-container--top">
                    <img src={saleImage} alt="Sale"/>
                    <div className="countdown">
                        {timeLeft}
                    </div>
                </div>
                <div className="event-container--bottom">
                    <Suspense fallback={<Loading/>}>
                        <SlickEvent data={dataEvent} slidesToShow={5}/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

export default Event;
