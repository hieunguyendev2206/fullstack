import React, {memo, useEffect, useState} from "react";
import "./BlogPage.scss";
import {getBlogs} from "../../../api/blog";
import moment from "moment";
import withBase from "../../../hocs/withBase";

function BlogPage({navigate}) {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const res = await getBlogs();
            if (res.success) {
                setData(res?.blog);
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="blogPage">
            <div className="content-blog-page">
                <div className="blogPage--new">
                    <h3>Mới nhất</h3>
                </div>
                {data?.map((item) => {
                    return (
                        <div
                            className="blogPage--box"
                            onClick={() => navigate(`/blog/${item.id}`)}
                        >
                            <div className="blogPage--box--left">
                                <img src={item?.avatar?.url} alt=""/>
                            </div>
                            <div className="blogPage--box--right">
                                <p className="blogPage--box--right--title">{item?.title}</p>
                                <p className="blogPage--box--right--time">
                                    {moment(item?.updatedAt).fromNow()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default withBase(memo(BlogPage));
