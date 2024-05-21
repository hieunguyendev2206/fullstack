import React, {memo, useEffect, useState} from "react";
import "./ProductInfor.scss";
import {useLocation, useParams} from "react-router-dom";
import {createReview, getProductId} from "../../../api/product";
import {formatNumber} from "../../../helper/format";
import withBase from "../../../hocs/withBase.js";
import {getCartUser} from "../../../redux/slice/cartSlice.js";
import {useSelector} from "react-redux";
import CardProductCbn from "../../../components/card/cardProduct/CardProductCbn.jsx";
import {addCart} from "../../../api/user.js";
import {toast} from "react-toastify";
import Rating from "../../../components/ratting/Rating.jsx";
import "moment/locale/vi";
import ModalCpn from "../../../components/common/Modal/ModalCpn.jsx";
import {IoMdClose} from "react-icons/io";
import {IoStar, IoStarOutline} from "react-icons/io5";
import Swal from "sweetalert2";

const moment = require("moment");

function ProductInfor({dispatch, navigate}) {
    const {id} = useParams();
    const {pathname} = useLocation();
    const [data, setData] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [activeQuantity, setActiveQuantity] = useState(null);
    const {data: listData} = useSelector((state) => state.products);
    const {user} = useSelector((state) => state.user);
    const [limitComment, setLimitComment] = useState(4);
    const [isComment, setIsComment] = useState(false);
    const [dataComment, setDataComment] = useState({
        rating: 0,
        comment: "",
    });
    const fetchData = async () => {
        try {
            const res = await getProductId(id);
            if (res.success) {
                setData(res?.product);
            }
        } catch (err) {
            console.log(err.reponse);
        }
    };

    let price = data?.price - (data?.price * data?.discount) / 100;
    const handleSelectColor = (item) => {
        setActiveQuantity(item);
    };
    const handleAddCard = async () => {
        try {
            if (!user) {
                Swal.fire({
                    title: "Bạn phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng",
                    showCancelButton: true,
                    confirmButtonText: "Đăng nhập",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem("url", pathname);
                        navigate("/auth");
                    }
                });
            } else {
                const dataFm = {
                    idProduct: data._id,
                    color: activeQuantity?.color
                        ? activeQuantity?.color
                        : data?.color[0]?.color,
                };
                const res = await addCart(user._id, dataFm);
                if (res.success) {
                    dispatch(getCartUser(res?.user.cart));
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công!',
                        text: 'Sản phẩm đã được thêm vào giỏ hàng!',
                        confirmButtonText: 'Đóng'
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Thất bại!',
                        text: 'Không thể thêm sản phẩm vào giỏ hàng!',
                        confirmButtonText: 'Đóng'
                    });
                }
            }
        } catch (err) {
            toast.warning(err?.response?.data?.mes);
        }
    };

    const listSuggest = listData
        ?.filter((el) => el?.category._id === data?.category._id)
        .filter((el) => el._id !== id);

    const handleSeeMore = () => {
        setLimitComment(data?.reviews?.length);
    };
    const handleStarClick = (starValue) => {
        setDataComment({...dataComment, rating: starValue});
    };
    const handleComment = async () => {
        try {
            if (!user) {
                Swal.fire({
                    title: "Bạn phải đăng nhập trước khi đánh giá",
                    showCancelButton: true,
                    confirmButtonText: "Đăng nhập",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem("url", pathname);
                        navigate("/auth");
                    }
                });
            }
            const res = await createReview(data?._id, dataComment);

            if (res?.success) {
                setIsComment(false);
                fetchData();
            }
        } catch (e) {
            setIsComment(false);
            toast.warning(e?.response?.data?.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="">
            <div className="productInfor">
                <div className="content-product-info">
                    <div className="productInfor--box">
                        <div className="productInfor--box--left">
                            <img src={activeImage || data?.image[0]?.url} alt=""/>
                            <div className="productInfor--box--left--listImg">
                                {data?.image?.slice(0, 3)?.map((item) => {
                                    return (
                                        <div
                                            className="productInfor--box--left--listImg--card"
                                            onClick={() => {
                                                setActiveImage(item?.url);
                                            }}
                                        >
                                            <img key={item?._id} src={item.url} alt=""/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="productInfor--box--right">
                            <h1>{data?.name}</h1>
                            <div className="productInfor--box--right--price">
                                {data?.discount > 0 ? (
                                    <>
                                        <p className="productInfor--box--right--price--price">
                                            {formatNumber(data?.price)}
                                        </p>
                                        <p className="productInfor--box--right--price--sale">
                                            {formatNumber(price)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="productInfor--box--right--price--sale">
                                        {formatNumber(data?.price)}
                                    </p>
                                )}
                            </div>
                            {<Rating star={Number(data?.ratings) || 5} size={20}/>}
                            <div className="productInfor--box--right--color">
                                <span>
                                    <p>Màu</p>
                                    <p>{activeQuantity?.color || data?.color[0]?.color}</p>
                                </span>
                                <div style={{display: "flex"}}>
                                    {data?.color.map((item) => (
                                        <div key={item?._id} onClick={() => handleSelectColor(item)}>
                                            <div
                                                style={{
                                                    height: "50px",
                                                    width: "50px",
                                                    borderRadius: "100%",
                                                    backgroundColor: `${item?.color}`,
                                                    cursor: "pointer",
                                                    marginRight: "8px",
                                                }}
                                            >
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <span>
                                    <p>Số lượng: </p>
                                    <p>{activeImage?.quantity || data?.color[0]?.quantity}</p>
                                </span>
                            </div>
                            <div className="productInfor--box--right--des">
                                <div style={{padding: "10px"}} dangerouslySetInnerHTML={{__html: data?.des}}/>
                            </div>
                            <div style={{backgroundColor: "transparent"}} className="btn">
                                <button
                                    disabled={activeQuantity?.quantity === 0}
                                    onClick={handleAddCard}
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {listSuggest && listSuggest.length > 0 && (
                <div className="suggest">
                    <div className="content-product-info">
                        <h2>Sản phẩm tương tự</h2>
                        <div className="suggest--list">
                            {listSuggest?.map((el) => {
                                return <CardProductCbn data={el}/>;
                            })}
                        </div>
                    </div>
                </div>
            )}
            <div className="comment">
                <div className="content--product">
                    <div className="comment--box">
                        <div className="comment--box--title">
                            <h3>Đánh giá trên {data?.name}</h3>
                        </div>
                        <div className="comment--box--star">
                            <div className="comment--box--star--title">
                                <h2>
                                    {isFinite(data?.ratings)
                                        ? Number.isInteger(data.ratings)
                                            ? data.ratings
                                            : Number(data.ratings.toFixed(2))
                                        : 5}
                                </h2>

                                <Rating star={Number(data?.ratings) || 5} size={20}/>
                                <p>Có {data?.reviews?.length} đánh giá</p>
                            </div>
                        </div>
                        {data?.reviews?.length > 0 && (
                            <div className="comment--box--list">
                                {data?.reviews?.slice(0, limitComment)?.map((item) => {
                                    return (
                                        <div className="comment--box--list--box">
                                            <h3>{item?.user.name}</h3>
                                            <Rating star={item.rating}/>
                                            <p>{item?.comment}</p>
                                            <p>{moment(item?.createAt).fromNow()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="comment--box--bottom">
                            <button
                                className="comment--box--bottom--left"
                                disabled={limitComment >= data?.reviews?.length}
                                onClick={handleSeeMore}
                            >
                                Tải thêm
                            </button>
                            <button
                                className="comment--box--bottom--right"
                                onClick={() => setIsComment(true)}
                            >
                                Viết đánh giá
                            </button>
                        </div>
                    </div>
                </div>
                <ModalCpn isOpen={isComment}>
                    <div className="Modal">
                        <div className="Modal--title">
                            <h3>Đánh giá sản phẩm</h3>
                            <div
                                className="Modal--title--button"
                                onClick={() => setIsComment(false)}
                            >
                                <IoMdClose size={24}/>;
                            </div>
                        </div>
                        <div className="Modal--content">
                            <div className="Modal--content--star">
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <span
                                        key={starValue}
                                        onClick={() => handleStarClick(starValue)}
                                        style={{cursor: "pointer"}}
                                    >
                    {starValue <= dataComment.rating ? (
                        <IoStar
                            style={{paddingRight: "8px"}}
                            color="#FF9921"
                            size={30}
                        />
                    ) : (
                        <IoStarOutline
                            style={{paddingRight: "8px"}}
                            size={30}
                        />
                    )}
                  </span>
                                ))}
                            </div>
                            <textarea
                                className="Modal--content--input"
                                placeholder="Mời bạn chia sẻ thêm cảm nhận..."
                                rows={8}
                                onChange={(e) =>
                                    setDataComment({...dataComment, comment: e.target.value})
                                }
                            />
                        </div>
                        <button
                            disabled={!dataComment.comment || dataComment.rating === 0}
                            onClick={handleComment}
                            className="Modal--submit"
                        >
                            Gửi đánh giá
                        </button>
                    </div>
                </ModalCpn>
            </div>
        </div>
    );
}

export default withBase(memo(ProductInfor));
