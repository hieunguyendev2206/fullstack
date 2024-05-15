import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slick.scss";
import CardEventCbn from "../card/cardEvent/CardEventCbn";

export default function SlickEvent(props) {
    const {data, slidesToShow, slidesToScroll} = props;
    const settings = {
        dots: false,
        infinite: true,
        pauseOnHover: false,
        autoplay: true,
        speed: 500,
        slidesToShow: slidesToShow ? slidesToShow : 1,
        slidesToScroll: slidesToScroll ? slidesToScroll : 1,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };
    return (
        <Slider {...settings}>
            {data?.map((el, index) => {
                return (
                    <div className="slick--size" key={index}>
                        <CardEventCbn data={el}/>
                    </div>
                );
            })}
        </Slider>
    );
}
