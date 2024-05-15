import React, {memo, useEffect, useState} from "react";
import "./ProductPage.scss";
import {useParams} from "react-router-dom";
import {getProductCategory} from "../../api/product";
import Logo from "../../styles/image/Logo.png";
import CardProductCbn from "../../components/card/cardProduct/CardProductCbn";
import {useSelector} from "react-redux";

function ProductPage() {
    const [dataProduct, setDataProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    let {category} = useParams();
    const {data} = useSelector((state) => state.category);
    const fetchdataProduct = async () => {
        try {
            setLoading(true);
            const res = await getProductCategory(category);
            setLoading(false);
            setDataProduct(res.products);
        } catch (e) {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchdataProduct();
    }, [category]);
    const nameCategory = data?.filter((el) => el?._id === category);
    return (
        <div className="product">
            <div className="content">
                <div className="product--name">
                    <img src={Logo} className="right--image" alt=""/>
                    <h1>{nameCategory[0]?.name}</h1>
                </div>
                {dataProduct?.length > 0 ? (
                    <div className="product--list">
                        {dataProduct?.map((el) => (
                            <CardProductCbn key={el.id} data={el}/>
                        ))}
                    </div>
                ) : (
                    <div className="product--null">
                        <h1>Xin lỗi, tạm thời chưa có sản phẩm!</h1>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(ProductPage);
