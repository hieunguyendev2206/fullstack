import React, {memo, useState} from "react";
import "./CreateBlog.scss";
import {useForm} from "react-hook-form";
import Edittor from "../../../common/inputComponet/Edittor";
import {createBlog} from "../../../../api/blog";
import withBase from "../../../../hocs/withBase.js";
import LoadingItem from "../../../Loading/LoadingItem.jsx";
import {toast} from "react-toastify";

function CreateBlog({setActive}) {
    const [image, setImage] = useState(null);
    const [des, setDes] = useState(null);
    const [loading, setLoading] = useState(false);
    const {
        register,
        formState: {errors},
        handleSubmit,
        setValue,
        reset,
    } = useForm();

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

    const onCreate = async (res) => {
        try {
            const data = {
                title: res.title,
                content: des,
                avatar: image,
            };
            setLoading(true);
            const respose = await createBlog(data);
            setLoading(false);
            if (respose.success) {
                setActive(7);
            }
        } catch (e) {
            setLoading(false);
            toast.warning(e?.response?.data?.mes);
        }
    };
    return (
        <LoadingItem isLoading={loading}>
            <div className="create">
                <div className="create--box">
                    <form action="" onSubmit={handleSubmit(onCreate)}>
                        <div className="create--box--lable">
                            <label className="create--box--lable--name" htmlFor="">
                                Tiêu đề
                            </label>
                            <input
                                className="create--box--lable--input"
                                placeholder="Nhập tiêu đề bài viết"
                                type="text"
                                id="title"
                                {...register("title", {required: true})}
                            />
                        </div>
                        {errors?.title && (
                            <p className="error-message">Tiêu đề không được bỏ trống</p>
                        )}
                        <div className="">
                            <Edittor value={des} setValue={setDes}/>
                        </div>
                        <div className="create--image">
                            <label htmlFor="image" className="create--image--bt">
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
                        <div className="create--submit">
                            <button
                                disabled={!des || !image}
                                type="submit"
                                className="create--submit--btn"
                            >
                                Tạo mới
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </LoadingItem>
    );
}

export default withBase(memo(CreateBlog));
