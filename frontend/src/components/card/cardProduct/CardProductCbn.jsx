import React, { memo } from "react";
import "./Card.scss";
import { formatNumber } from "../../../helper/format";
import withBase from "../../../hocs/withBase";

function CardProductCbn({ data, navigate }) {
    const handleNavigate = () => {
        navigate(`/product/${data._id}`);
    };

    const isDiscounted = data?.discount && data.discount > 0;

    return (
        <div key={data?.id} className="box-card-product" onClick={handleNavigate}>
            <div className="box-card-product--image">
                <img
                    className="box-card-product--image--img"
                    src={data.image[0].url}
                    alt=""
                />
            </div>
            <div className="box-card-product--content">
                <p className="box-card-product--content--name">{data?.name}</p>
                <div className="box-card-product--content--monney">
                    {isDiscounted ? (
                        <>
                            <p className="box-card-product--content--monney--price with-discount">
                                {formatNumber(data?.price)}
                            </p>
                            <p className="box-card-product--content--monney--sale">
                                {formatNumber(data?.price - (data?.price * data.discount) / 100)}
                            </p>
                        </>
                    ) : (
                        <p className="box-card-product--content--monney--sale no-discount">
                            {formatNumber(data?.price)}
                        </p>
                    )}
                </div>
                <div className="box-card-product--content--loader">
                    <div className="box-card-product--content--loader--color">
                        Còn {data?.quantity}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withBase(memo(CardProductCbn));
