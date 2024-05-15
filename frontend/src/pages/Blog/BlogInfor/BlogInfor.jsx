import React, {memo, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./BlogInfor.scss";
import {getBlog} from "../../../api/blog";

function BlogInfor() {
    const {id} = useParams();
    const [data, setData] = useState();
    const fetchlog = async () => {
        try {
            const res = await getBlog(id);
            if (res.success) {
                setData(res?.blog);
            }
        } catch (e) {
        }
    };
    useEffect(() => {
        fetchlog();
    }, [id]);
    return (
        <div className="blogInfor">
            <div className="content">
                <div className="blogInfor--box">
                    <h2>{data?.title}</h2>
                    <div
                        className="blogInfor--box--content"
                        dangerouslySetInnerHTML={{__html: data?.content}}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default memo(BlogInfor);
