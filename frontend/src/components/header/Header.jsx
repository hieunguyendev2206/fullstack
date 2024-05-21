import React, {memo, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Logo from "../../styles/image/Logo.png";
import "./Header.scss";
import {RiSearchLine} from "react-icons/ri";
import {IoBagOutline, IoMenu} from "react-icons/io5";
import {FaRegUser} from "react-icons/fa";
import Input from "../common/inputComponet/Input";
import {MdClose} from "react-icons/md";
import Screen from "../screenOverlay/Screen";
import withBase from "../../hocs/withBase";
import {refreshToken, userTK} from "../../api/user";
import {getUser} from "../../redux/slice/userSlice";
import Cookies from "js-cookie";
import {getProductSearch} from "../../api/product";
import {formatNumber} from "../../helper/format";
import {getCartUser} from "../../redux/slice/cartSlice";
import Sidebar from "../sidebar/Sidebar";
import Swal from "sweetalert2";

function Header({navigate, dispatch}) {
    const {data, isLoading} = useSelector((state) => state.category);
    const {user} = useSelector((state) => state.user);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [active, setActive] = useState(-1);
    const [showSearch, setShowSearch] = useState(false);
    const [showInFor, setShowInFor] = useState(false);
    const [valueSearch, setValueSearch] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [activeHeader, setActiveHeader] = useState(false);
    const [listMenuRpt, setListMenuRp] = useState(false);
    const refSearch = useRef(null);
    const {data: cart} = useSelector((state) => state.car);

    useEffect(() => {
        const toastSeen = sessionStorage.getItem("toastSeen");
        if (toastSeen === "true") {
            setTimeout(() => {
                Swal.fire({
                    title: "Đơn hàng của bạn đã được đặt!",
                    text: "Đến xem đơn hàng của bạn.",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/order");
                });
                sessionStorage.removeItem("toastSeen");
            }, 3000);
        }
    }, [navigate]);

    const handleNavigate = (active, el) => {
        setActive(active);
        navigate(`/category/${el._id}`);
    };

    const handleNavigateBlog = () => {
        setActive(8);
        setListMenuRp(false);
        navigate("/blog");
    };

    const fetchUser = async () => {
        try {
            const res = await userTK();
            if (res.success) {
                dispatch(getUser(res?.user));
                dispatch(getCartUser(res?.user?.cart));
                setProfilePicture(res?.user?.profilePicture);
            }
        } catch (e) {
            if (e?.response?.status === 401) {
                try {
                    const reset = await refreshToken();
                    if (reset.success) {
                        Cookies.set("accesstoken", reset?.response?.token);
                    }
                } catch (e2) {
                    dispatch(getUser(null));
                    dispatch(getCartUser(null));
                }
            } else {
                console.log(e);
            }
        }
    };

    const handleStatusSearch = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setValueSearch(value);
        if (refSearch.current !== null) {
            clearTimeout(refSearch.current);
        }
        refSearch.current = setTimeout(() => {
            if (valueSearch !== " ") {
                getDataSearch();
            }
        }, 500);
    };

    const getDataSearch = async () => {
        const res = await getProductSearch(valueSearch);
        if (res.success) {
            setListSearch(res.products);
            setNoResults(res.products.length === 0);
        }
    };

    const handleClickSearch = (item) => {
        navigate(`/product/${item._id}`);
        setValueSearch("");
        setListSearch([]);
        setShowSearch(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                setActiveHeader(true);
            } else {
                setActiveHeader(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className={`header ${activeHeader && "activeHeader"} ${showSearch && "search-active"}`}>
            <div className="content-header">
                <div className={`header--content ${showSearch && "none"}`}>
                    <div
                        className="header--content--left"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        <div className="left">
                            <p style={{margin: 0, fontSize: "28px"}}>top</p>
                            <p style={{margin: 0, fontSize: "28px", color: "red"}}>Z</p>
                            <p style={{margin: 0, fontSize: "28px", color: "#07A056", fontStyle: "oblique"}}>0</p>
                            <p style={{margin: 0, fontSize: "28px", color: "#03AEF1", fontStyle: "oblique"}}>N</p>
                            <p style={{margin: 0, fontSize: "28px", color: "#C3158CFF", fontStyle: "oblique"}}>E</p>
                        </div>
                        <div className="right">
                            <img src={Logo} className="right--image" alt=""/>
                        </div>
                    </div>
                    <div className="header--content--reponsive">
                        <span onClick={() => setListMenuRp(true)}>
                            <IoMenu size={24}/>
                        </span>
                    </div>
                    <div className="header--content--logo" onClick={() => navigate("/")}>
                        <p style={{margin: 0, fontSize: "28px"}}>top</p>
                        <p style={{margin: 0, fontSize: "28px", color: "red"}}>Z</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#07A056", fontStyle: "oblique"}}>0</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#03AEF1", fontStyle: "oblique"}}>N</p>
                        <p style={{margin: 0, fontSize: "28px", color: "#C3158CFF", fontStyle: "oblique"}}>E</p>
                    </div>
                    <div className="header--content--center">
                        {data?.map((el, index) => {
                            return (
                                <div
                                    className={`box  ${index === active && "active"}`}
                                    key={el?.id}
                                    onClick={() => handleNavigate(index, el)}
                                >
                                    <p className="item">{el?.name}</p>
                                </div>
                            );
                        })}
                        {data && (
                            <div
                                className={`box  ${active === 8 && "active"}`}
                                onClick={handleNavigateBlog}
                            >
                                <p className="item">Tin Tức</p>
                            </div>
                        )}
                    </div>
                    <div className="header--content--right">
                        <div className="header--content--right--search">
                            <label onClick={handleStatusSearch}>
                                <RiSearchLine/>
                            </label>
                            <div
                                className="header--content--right--card"
                                onClick={() => navigate("/payment")}
                            >
                                <label>
                                    <IoBagOutline/>
                                </label>
                                <p className="header--content--right--card--number">
                                    {cart?.length || 0}
                                </p>
                            </div>
                        </div>
                        {user ? (
                            <div
                                className="header--content--right--user"
                                onClick={() => setShowInFor(!showInFor)}
                            >
                                <div
                                    className="profile-picture"
                                    style={{
                                        backgroundImage: `url(${profilePicture || 'path_to_default_image'})`
                                    }}
                                >
                                    {!profilePicture && <FaRegUser className="icon"/>}
                                </div>
                                {showInFor && (
                                    <div className="header--content--right--user--show">
                                        <p onClick={() => setShowInFor(!showInFor)}
                                           style={{
                                               color: "white",
                                               paddingRight: "5px",
                                               fontWeight: "800",
                                               fontSize: "16px",
                                               cursor: "pointer"
                                           }}>
                                            {user?.name}
                                        </p>
                                        {user?.role === "Admin" && (
                                            <div onClick={() => navigate("/admin")}>
                                                <p>Quản lý</p>
                                            </div>
                                        )}
                                        <div onClick={() => navigate("/user")}>
                                            <p>Tài khoản</p>
                                        </div>
                                        <div onClick={() => navigate("/order")}
                                        >
                                            <p>Đơn hàng</p>
                                        </div>
                                        <div
                                            onClick={() => {
                                                Cookies.remove("accesstoken");
                                                dispatch(getUser(null));
                                                navigate("/auth");
                                            }}
                                        >
                                            <p>Đăng xuất</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="authen" onClick={() => navigate("/auth")}>
                                <button className="button-login">Login</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="search">
                    {showSearch && (
                        <div className="header--search">
                            <label>
                                <RiSearchLine/>
                            </label>
                            <Input placeholder="Tìm kiếm sản phẩm" onChange={handleSearch}/>
                            <label onClick={handleStatusSearch}>
                                <MdClose/>
                            </label>
                            <div className="header--search--list">
                                {noResults && <p>Không tìm thấy sản phẩm</p>}
                                {listSearch?.map((item) => (
                                    <div
                                        className="header--search--list--box"
                                        onClick={() => handleClickSearch(item)}
                                    >
                                        <div className="header--search--list--box--left">
                                            <img src={item?.image[0]?.url} alt=""/>
                                        </div>
                                        <div className="header--search--list--box--right">
                                            <h3>{item?.name}</h3>
                                            <h2>{formatNumber(item?.price)}</h2>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {showSearch && <Screen/>}
                {listMenuRpt && (
                    <Sidebar setListMenuRp={setListMenuRp}>
                        <div className="sidebarItem">
                            {data?.map((el, index) => {
                                return (
                                    <div
                                        className={`sidebarItem--box  ${
                                            index === active && "active"
                                        }`}
                                        key={el?.id}
                                        onClick={() => {
                                            handleNavigate(index, el);
                                            setListMenuRp(false);
                                        }}
                                    >
                                        <p className="item">{el?.name}</p>
                                    </div>
                                );
                            })}
                            {data && (
                                <div
                                    className={`sidebarItem--box  ${active === 7 && "active"}`}
                                    onClick={handleNavigateBlog}
                                >
                                    <p className="item">Tin Tức</p>
                                </div>
                            )}
                        </div>
                    </Sidebar>
                )}
            </div>
        </div>
    );
}

export default withBase(memo(Header));
