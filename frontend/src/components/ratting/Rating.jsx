import React, {memo} from "react";
import {IoStar, IoStarHalf, IoStarOutline} from "react-icons/io5";

function Rating({star, size}) {
    const start = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= star) {
            start.push(<IoStar color="#FF9921" size={size || 12}/>);
        } else if (i === Math.ceil(star) && !Number.isInteger(star)) {
            start.push(<IoStarHalf key={i} color="#FF9921" size={size || 12}/>);
        } else {
            start.push(<IoStarOutline size={size || 12} color="#C2C2C2"/>);
        }
    }
    return <div>{start}</div>;
}

export default memo(Rating);
