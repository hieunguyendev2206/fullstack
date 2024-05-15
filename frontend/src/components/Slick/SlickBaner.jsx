import React, {memo} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slick.scss";
import Loading from "../Loading/Loading";

const Slick = (props) => {
    const {data, slidesToShow, slidesToScroll} = props;
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: slidesToShow ? slidesToShow : 1,
        slidesToScroll: slidesToScroll ? slidesToScroll : 1,
    };
    return !data ? (
        <Loading/>
    ) : (
        <Slider {...settings}>
            {data?.map((el, index) => {
                return (
                    <div className="slick--size" key={index}>
                        <img className="slick--size--image" src={el?.image?.url} alt=""/>
                    </div>
                );
            })}
        </Slider>
    );
};

export default memo(Slick);
