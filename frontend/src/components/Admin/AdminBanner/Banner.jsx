import React, {useEffect, useState} from "react";
import "./Banner.scss";
import {createBaner, deleteBanner, getBanner} from "../../../api/banner";
import {AiOutlineDelete} from "react-icons/ai";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import DrawerCpn from "../../common/Drawer/Drawer";

function Banner() {
    const [dataBanner, setDataBanner] = useState([]);
    const [isOpen, setisOpen] = useState(false);
    const [image, setImage] = useState(null);

    const fetchbanner = async () => {
        const res = await getBanner();
        setDataBanner(res?.response);
    };
    useEffect(() => {
        fetchbanner();
    }, []);
    const handleDelete = async (data) => {
        try {
            const id = data._id;
            Swal.fire({
                title: "Bạn có muốn xóa danh mục này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await deleteBanner(id);

                    if (res?.success) {
                        toast.success(res?.mes);
                        Swal.fire("Đã xóa!", "", "Thành công");
                        fetchbanner();
                    }
                }
            });
        } catch (e) {
        }
    };
    const handleImg = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const render = new FileReader();
        render.onloadend = () => {
            const result = render.result;
            setImage(result);
        };

        render.readAsDataURL(file);
    };
    const handleCreate = async () => {
        try {
            if (!image) {
                toast.warning("Bạn phải chọn ảnh");
            }
            const res = await createBaner({image: image});
            if (res.success) {
                fetchbanner();
                setisOpen(false);
                toast.success("Tạo thành công");
            }
        } catch (e) {
        }
    };
    return (
        <div>
            <button
                onClick={() => setisOpen(true)}
                style={{
                    margin: "2%",
                }}
                className="btn"
            >
                Tạo mới
            </button>
            <div className="banner">
                <div className="content-admin">
                    {dataBanner?.map((banner) => (
                        <div className="banner--box">
                            <div className="banner--box--left">
                                <img src={banner?.image?.url} alt=""/>
                            </div>
                            <div className="banner--box--right">
                <span onClick={() => handleDelete(banner)}>
                  <AiOutlineDelete size={16}/>
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <DrawerCpn isOpen={isOpen} setisOpen={setisOpen}>
                <div className="drawer-bn">
                    <div className="drawer-bn--image">
                        <label htmlFor="image" className="drawer-bn--image--img">
                            Ảnh
                        </label>
                        <input
                            id="image"
                            type="file"
                            hidden
                            onChange={(e) => handleImg(e)}
                        />
                        {image && (
                            <img
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    paddingLeft: "20px",
                                }}
                                src={image}
                                alt=""
                            />
                        )}
                    </div>
                    <div className="drawer-bn--btn">
                        <button onClick={handleCreate} className="btn" type="submit">
                            Tạo mới
                        </button>
                    </div>
                </div>
            </DrawerCpn>
        </div>
    );
}

export default Banner;
