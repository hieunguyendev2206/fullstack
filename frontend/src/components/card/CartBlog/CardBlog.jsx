import React, {memo} from "react";
import "./CardBlog.scss";
import withBase from "../../../hocs/withBase";

function CardBlog({data, navigate}) {
    return (
        <div
            key={data?.id}
            className="cardBlog"
            onClick={() => navigate(`/blog/${data.id}`)}
        >
            <div className="cardBlog--image">
                <img src={data?.avatar?.url} alt=""/>
            </div>
            <div className="cardBlog--content">
                <p>
                    {data?.title.length > 100
                        ? data?.title.slice(0, 100) + "..."
                        : data?.title}
                </p>
            </div>
        </div>
    );
}

export default withBase(memo(CardBlog));
