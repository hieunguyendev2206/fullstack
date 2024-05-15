import React, {memo, useCallback} from "react";
import {useSelector} from "react-redux";
import "./Category.scss";
import withBase from "../../hocs/withBase";

function Category({navigate}) {
    const {data} = useSelector((state) => state.category);
    const handleNavigate = useCallback((el) => {
        navigate(`/category/${el._id}`);
    }, []);
    return (
        <div className="content-category">
            <div className="box-category">
                {data?.map((el) => {
                    return (
                        <div
                            key={el?.id}
                            className="box-category--card"
                            onClick={() => handleNavigate(el)}
                        >
                            <img src={el?.image?.url} alt=""/>
                            <p>{el?.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default withBase(memo(Category));
