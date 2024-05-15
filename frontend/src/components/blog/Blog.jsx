import React, {memo, useCallback, useEffect, useState} from "react";
import {getBlogs} from "../../api/blog";
import "./Blog.scss";
import CardBlog from "../card/CartBlog/CardBlog";

function Blog() {
    const [data, setData] = useState(null);
    const fetchData = useCallback(async () => {
        try {
            const res = await getBlogs();
            if (res.success) {
                setData(res?.blog);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    if (data == null || data.length === 0) {
        return null;
    }

    return (
        <div className="blogitem">
            <div className="blogitem--name">
                <h1>Tin tức</h1>
            </div>
            <div className="content-blog">
                <div className="blogitem--list">
                    {data?.map((item) => {
                        return <CardBlog data={item} key={item._id}/>;
                    })}
                </div>
            </div>
        </div>
    );
}

export default memo(Blog);
