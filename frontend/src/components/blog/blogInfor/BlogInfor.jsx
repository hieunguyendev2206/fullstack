import React from "react";
import "./BlogInfor.scss";
import {useParams} from "react-router-dom";

function BlogInfor() {
    let {id} = useParams();
    return (
        <div className="blogInfor">
            <div className="blogInfor--content"></div>
        </div>
    );
}

export default BlogInfor;
