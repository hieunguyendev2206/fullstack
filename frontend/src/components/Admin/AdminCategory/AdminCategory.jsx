import React, {memo, useState} from "react";
import {useSelector} from "react-redux";
import Tabble from "../../common/Tabble/Tabble";
import {FaPencilAlt} from "react-icons/fa";
import {AiOutlineDelete} from "react-icons/ai";
import Swal from "sweetalert2";
import * as categoryApi from "../../../api/category";
import "./AdminCategory.scss";
import {CiCirclePlus} from "react-icons/ci";
import DrawerCpn from "../../common/Drawer/Drawer";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import withBase from "../../../hocs/withBase";
import {fetchCategory} from "../../../redux/slice/categorySlice";
import LoadingItem from "../../Loading/LoadingItem";

function AdminCategory({dispatch}) {
    const {data} = useSelector((state) => state.category);
    const [isOpen, setisOpen] = useState(false);
    const [isOpenUpdate, setisOpenUpdate] = useState(false);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [valueUpdated, setValueUpdated] = useState(null);
    const {
        register,
        formState: {errors},
        handleSubmit,
        setValue,
        reset,
    } = useForm();
    const columns = [
        {
            Header: "ID",
            accessor: "_id",
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Image",
            accessor: "image",
            Cell: ({value}) => (
                <img src={value.url} alt="" style={{width: "50px", height: "50px"}}/>
            ),
        },
        {
            Header: "Actions",
            Cell: ({row}) => (
                <div style={{display: "flex"}}>
          <span
              onClick={() => handleDelete(row)}
              style={{
                  padding: "8px",
                  border: "1px black solid",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  marginRight: "2px",
                  color: "red",
                  cursor: "pointer",
              }}
          >
            <AiOutlineDelete/>
          </span>
                    <span
                        onClick={() => handleOpenEdit(row)}
                        style={{
                            padding: "8px",
                            border: "1px black solid",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                            color: "green",
                            cursor: "pointer",
                        }}
                    >
            <FaPencilAlt/>
          </span>
                </div>
            ),
        },
    ];

    const handleDelete = async (data) => {
        try {
            const {_id} = data?.values;
            Swal.fire({
                title: "Bạn có muốn xóa danh mục này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    const res = await categoryApi.deleteCategory(_id);
                    setLoading(false);
                    if (res?.success) {
                        toast.success(res?.mes);
                        dispatch(fetchCategory());
                        Swal.fire("Đã xóa!", "", "Thành công");
                    }
                }
            });
        } catch (err) {
            setLoading(false);
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
    const onCreate = async (res) => {
        try {
            if (!image) return toast.warning("Ảnh không được để trống");
            const data = {name: res?.name, image: image};
            setLoading(true);

            const response = await categoryApi.createCategory(data);
            setLoading(false);

            if (response?.success) {
                setImage(null);
                reset();
                dispatch(fetchCategory());
                setisOpen(false);
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };
    const handleOpenEdit = (data) => {
        setImage(null);
        setValueUpdated(data?.values);
        setValue("name", data?.values?.name);
        setisOpenUpdate(true);
    };
    const handleUpdate = async (res) => {
        try {
            const data = {
                name: res?.name,
                image: image ? image : valueUpdated?.image?.url,
            };
            const id = valueUpdated?._id;
            setLoading(true);
            const response = await categoryApi.updateCategory(id, data);
            setLoading(false);
            if (response.success) {
                toast.success("Cập nhật danh mục thành công");
                dispatch(fetchCategory());
                reset();
                setisOpenUpdate(false);
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    };
    return (
        <LoadingItem isLoading={loading}>
            <div className="category">
                <div className="category--create">
                    <div
                        className="category--create--btn"
                        onClick={() => setisOpen(true)}
                    >
                        <CiCirclePlus size={24}/>
                        <p>Tạo mới</p>
                    </div>
                </div>
                <Tabble title="Danh mục sản phẩm" data={data || []} columns={columns}/>
                <DrawerCpn isOpen={isOpen} setisOpen={setisOpen}>
                    <div className="drawer-form">
                        <form action="" onSubmit={handleSubmit(onCreate)}>
                            <div>
                                <label htmlFor="">Tên danh mục</label>
                                <span>
                  <input
                      placeholder="Nhập tên danh mục"
                      type="text"
                      id="name"
                      {...register("name", {required: true})}
                  />
                </span>
                                {errors?.name && (
                                    <p className="error-message">
                                        Tên danh mục không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div className="drawer-form--image">
                                <label htmlFor="image" className="drawer-form--image--img">
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
                            <div className="drawer-form--btn">
                                <button type="submit">Tạo mới</button>
                            </div>
                        </form>
                    </div>
                </DrawerCpn>
                <DrawerCpn isOpen={isOpenUpdate} setisOpen={setisOpenUpdate}>
                    <div className="drawer-form">
                        <form action="" onSubmit={handleSubmit(handleUpdate)}>
                            <div>
                                <label htmlFor="">Tên danh mục</label>
                                <span>
                  <input
                      placeholder="Nhập tên danh mục"
                      type="text"
                      id="name"
                      {...register("name", {required: true})}
                  />
                </span>
                                {errors?.name && (
                                    <p className="error-message">
                                        Tên danh mục không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div className="drawer-form--image">
                                <label htmlFor="image" className="drawer-form--image--img">
                                    Ảnh
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    hidden
                                    onChange={(e) => handleImg(e)}
                                />
                                {image ? (
                                    <img
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            paddingLeft: "20px",
                                        }}
                                        src={image}
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            paddingLeft: "20px",
                                        }}
                                        src={valueUpdated?.image?.url}
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="drawer-form--btn">
                                <button type="submit">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </DrawerCpn>
            </div>
        </LoadingItem>
    );
}

export default withBase(memo(AdminCategory));
