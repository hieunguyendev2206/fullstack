import React, {memo} from "react";
import "./Product.scss";
import CardProductCbn from "../card/cardProduct/CardProductCbn";
import Logo from "../../styles/image/Logo.png";

function Product({data, category}) {
    return (
        <div className="content-product">
            <div className="box-product">
                {data && data?.length > 0 ? (
                    <div className="box-product--main">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <img
                                src={Logo}
                                className="right--image"
                                alt=""
                                style={{width: "50px", height: "50px"}}
                            />
                            <h1>{category?.name}</h1>
                        </div>
                        <div className="box-product--product">
                            {data?.map((item) => (
                                <CardProductCbn data={item} key={item.id}/>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default memo(Product);
