import React, {memo, useState} from "react";
import {useSelector} from "react-redux";
import Tabble from "../../common/Tabble/Tabble";
import {FaPencilAlt} from "react-icons/fa";
import {AiOutlineDelete} from "react-icons/ai";
import Swal from "sweetalert2";
import * as productApi from "../../../api/product";
import "./AdminProduct.scss";
import {CiCirclePlus} from "react-icons/ci";
import DrawerCpn from "../../common/Drawer/Drawer";
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import withBase from "../../../hocs/withBase";
import LoadingItem from "../../Loading/LoadingItem";
import {colors} from "../../../static/Admin";
import Edittor from "../../common/inputComponet/Edittor";
import {fetchProduct} from "../../../redux/slice/productSlice";
import {formatNumber} from "../../../helper/format";

function AdminProduct({dispatch}) {
    const {data} = useSelector((state) => state.products);
    const {data: category} = useSelector((state) => state.category);
    const [isOpen, setisOpen] = useState(false);
    const [isOpenUpdate, setisOpenUpdate] = useState(false);
    const [image, setImage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [valueUpdated, setValueUpdated] = useState(null);
    const [color, setColor] = useState({
        color: "",
        quantity: "",
    });
    const [listColor, setListColor] = useState([]);
    const [des, setDes] = useState("");
    const {
        register,
        formState: {errors},
        handleSubmit,
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
            Header: "Category",
            accessor: "category",
            Cell: ({value}) => <p>{value?.name}</p>,
        },
        {
            Header: "Discount",
            accessor: "discount",
        },
        {
            Header: "Image",
            accessor: "image",
            Cell: ({value}) => (
                <img
                    loading="lazy"
                    src={value[0].url}
                    alt=""
                    style={{width: "50px", height: "50px"}}
                />
            ),
        },
        {
            Header: "Price",
            accessor: "price",
            Cell: ({value}) => <p>{formatNumber(value)}</p>,
        },
        {
            Header: "Description",
            accessor: "des",
            Cell: ({value}) => {
                const desc = value?.slice(0, 8);
                return <div dangerouslySetInnerHTML={{__html: desc}}></div>;
            },
        },
        {
            Header: "Color",
            accessor: "color",
            Cell: ({value}) => (
                <div>
                    {value?.map((item, index) => (
                        <div style={{display: "flex"}} key={index}>
                            <span style={{display: "flex"}}>
                                <p>Màu:</p>
                                <p>{item.color}</p>
                            </span>
                            <span style={{display: "flex", paddingLeft: "4px"}}>
                                <p>{item?.quantity}</p>
                            </span>
                        </div>))}
                </div>
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
                title: "Bạn có muốn xóa sản phẩm này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    const res = await productApi.deleteProduct(_id);
                    setLoading(false);
                    if (res?.success) {
                        toast.success(res?.mes);
                        dispatch(fetchProduct());
                        Swal.fire("Đã xóa!", "", "Thành công");
                    }
                }
            });
        } catch (err) {
            setLoading(false);
        }
    };

    const handleImg = (e) => {
        const file = e.target.files;
        const results = [];
        if (!file) return;
        for (let i = 0; i < file.length; i++) {
            const render = new FileReader();
            render.onloadend = () => {
                results.push(render.result);
                if (results.length === file.length) {
                    setImage(results);
                }
            };

            render.readAsDataURL(file[i]);
        }
    };
    const onCreate = async (res) => {
        try {
            if (image.length === 0) return toast.warning("Ảnh không được để trống");
            if (listColor.length === 0)
                return toast.warning("Bạn phải nhập số lượng và màu sắc");
            const data = {
                name: res?.name,
                category: res.category,
                discount: res.discount,
                image: image,
                color: listColor,
                price: res.price,
                des: des,
            };
            setLoading(true);
            const response = await productApi.createProduct(data);
            setLoading(false);
            if (response?.success) {
                setImage(null);
                reset();
                dispatch(fetchProduct());
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
        setisOpenUpdate(true);
    };

    const handOnchageColor = (e) => {
        setColor({...color, color: e.target.value});
    };
    const handleAddColor = () => {
        if (!color.color || !color.quantity) {
            toast.warning("Bạn không được bỏ trống");
        } else if (!listColor?.some((item) => item.color === color.color)) {
            setListColor((prevListColor) => [...prevListColor, color]);
        } else {
            toast.warning("Màu này đã tồn tại");
        }
    };
    const handleDeleteColor = (item) => {
        const filter = listColor?.filter((el) => el.color !== item.color);
        setListColor(filter);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name: valueUpdated.name,
                category: valueUpdated.category,
                des: valueUpdated.des,
                discount: valueUpdated.discount,
                price: valueUpdated.price,
                image: image ? image : valueUpdated.image,
                color: valueUpdated.color,
            };
            setLoading(true);
            const res = await productApi.updateProduct(valueUpdated._id, data);
            setLoading(false);
            if (res.success) {
                setImage(null);
                setisOpenUpdate(false);
                dispatch(fetchProduct());
            }
        } catch (e) {
            setLoading(false);
            toast.error(e?.response?.statusText);
        }
    };
    return (
        <LoadingItem isLoading={loading}>
            <div className="product-admin">
                <div className="product-admin--create">
                    <div
                        className="product-admin--create--btn"
                        onClick={() => setisOpen(true)}
                    >
                        <CiCirclePlus size={24}/>
                        <p>Tạo mới</p>
                    </div>
                </div>
                <div style={{height: "90vh", overflowY: "scroll"}}>
                    <Tabble title="Sản phẩm" data={data || []} columns={columns}/>
                </div>
                <DrawerCpn isOpen={isOpen} setisOpen={setisOpen}>
                    <div className="drawer-form-product">
                        <form action="" onSubmit={handleSubmit(onCreate)}>
                            <div>
                                <label htmlFor="">Tên sản phẩm</label>
                                <span>
                  <input
                      placeholder="Nhập tên sản phẩm"
                      type="text"
                      id="name"
                      {...register("name", {required: true})}
                  />
                </span>
                                {errors?.name && (
                                    <p className="error-message">
                                        Tên sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="category">Loại sản phẩm</label>
                                <select
                                    style={{width: "100%", margin: "8px 0", outline: "none"}}
                                    id="category"
                                    {...register("category", {required: true})}
                                >
                                    <option value="">--Chọn loại--</option>
                                    {category?.map((item) => (
                                        <option value={item._id} key={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="error-message">Vui lòng chọn loại sản phẩm</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="">Giá sản phẩm</label>
                                <span>
                  <input
                      placeholder="Nhập giá sản phẩm"
                      type="text"
                      id="price"
                      {...register("price", {required: true})}
                  />
                </span>
                                {errors?.name && (
                                    <p className="error-message">
                                        Giá sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="">Giảm giá</label>
                                <span>
                  <input
                      placeholder="Phần trăm giảm giá"
                      type="text"
                      id="discount"
                      {...register("discount", {required: true})}
                  />
                </span>
                                {errors?.discount && (
                                    <p className="error-message">
                                        Giảm giá sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <label>Màu</label>
                                <select
                                    style={{width: "35%", margin: "8px 8px", outline: "none"}}
                                    id="category"
                                    onChange={handOnchageColor}
                                >
                                    <option value="">--Chọn màu--</option>
                                    {colors?.map((item, index) => (
                                        <option value={item.name} key={index}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    style={{
                                        width: "35%",
                                        border: "1px solid black",
                                        padding: "0",
                                        color: "black",
                                    }}
                                    onChange={(e) =>
                                        setColor({...color, quantity: e.target.value})
                                    }
                                    placeholder="Vui lòng nhập số lượng"
                                />
                                <p
                                    onClick={handleAddColor}
                                    style={{
                                        width: "30%",
                                        margin: "0px 8px",
                                        backgroundColor: "black",
                                        color: "white",
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        display: "flex",
                                        cursor: "pointer",
                                    }}
                                >
                                    Thêm vào
                                </p>
                            </div>
                            {listColor?.map((item) => (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyItems: "",
                                        alignItems: "center",
                                    }}
                                >
                                    <div style={{display: "flex", paddingRight: "20px"}}>
                                        <p style={{fontWeight: "bold"}}>Màu: </p>
                                        <p style={{paddingLeft: "8px"}}>{item?.color}</p>
                                    </div>
                                    <div style={{display: "flex"}}>
                                        <p style={{fontWeight: "bold"}}>Số lượng: </p>
                                        <p style={{paddingLeft: "8px"}}>{item?.quantity}</p>
                                    </div>
                                    <button
                                        style={{marginLeft: "8px"}}
                                        className="btn"
                                        onClick={() => handleDeleteColor(item)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <div style={{width: "100%", overflowX: "auto"}} className="">
                                <Edittor value={des} setValue={setDes}/>
                            </div>

                            <div className="drawer-form-product--image">
                                <label
                                    htmlFor="image"
                                    className="drawer-form-product--image--img"
                                >
                                    Ảnh
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={(e) => handleImg(e)}
                                />
                                {image && (
                                    <div style={{marginTop: "10px"}}>
                                        {image.map((el) => (
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    paddingLeft: "20px",
                                                }}
                                                src={el}
                                                alt=""
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="drawer-form-product--btn">
                                <button type="submit">Tạo mới</button>
                            </div>
                        </form>
                    </div>
                </DrawerCpn>
                <DrawerCpn isOpen={isOpenUpdate} setisOpen={setisOpenUpdate}>
                    <div className="drawer-form-product">
                        <form action="" onSubmit={handleUpdate}>
                            <div>
                                <label htmlFor="">Tên sản phẩm</label>
                                <span>
                  <input
                      placeholder="Nhập tên sản phẩm"
                      type="text"
                      id="name"
                      defaultValue={valueUpdated?.name}
                      onChange={(e) =>
                          setValueUpdated({...valueUpdated, name: e.target.value})
                      }
                  />
                </span>
                                {!valueUpdated?.name && (
                                    <p className="error-message">
                                        Tên sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="category">Loại sản phẩm</label>
                                <select
                                    style={{width: "100%", margin: "8px 0", outline: "none"}}
                                    id="category"
                                    onChange={(e) =>
                                        setValueUpdated({
                                            ...valueUpdated,
                                            category: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">--Chọn loại--</option>
                                    {category?.map((item) => (
                                        <option value={item._id} key={item._id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                {!valueUpdated?.category && (
                                    <p className="error-message">Vui lòng chọn loại sản phẩm</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="">Giá sản phẩm</label>
                                <span>
                  <input
                      placeholder="Nhập giá sản phẩm"
                      type="text"
                      id="price"
                      defaultValue={valueUpdated?.price}
                      onChange={(e) =>
                          setValueUpdated({
                              ...valueUpdated,
                              price: e.target.value,
                          })
                      }
                  />
                </span>
                                {!valueUpdated?.price && (
                                    <p className="error-message">
                                        Giá sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="">Giảm giá</label>
                                <span>
                  <input
                      placeholder="Phần trăm giảm giá"
                      type="text"
                      id="discount"
                      defaultValue={valueUpdated?.discount}
                      onChange={(e) =>
                          setValueUpdated({
                              ...valueUpdated,
                              discount: e.target.value,
                          })
                      }
                  />
                </span>
                                {!valueUpdated?.discount && (
                                    <p className="error-message">
                                        Giảm giá sản phẩm không được bỏ trống
                                    </p>
                                )}
                            </div>
                            <div style={{width: "100%", overflowX: "auto"}} className="">
                                <Edittor
                                    value={valueUpdated?.des}
                                    setValue={(value) =>
                                        setValueUpdated({...valueUpdated, des: value})
                                    }
                                />
                            </div>

                            <div className="drawer-form-product--image">
                                <label
                                    htmlFor="image"
                                    className="drawer-form-product--image--img"
                                >
                                    Ảnh
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={(e) => handleImg(e)}
                                />
                                {image ? (
                                    <div style={{marginTop: "10px"}}>
                                        {image.map((el) => (
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    paddingLeft: "20px",
                                                }}
                                                src={el}
                                                alt=""
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{marginTop: "10px"}}>
                                        {valueUpdated?.image?.map((el) => (
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    paddingLeft: "20px",
                                                }}
                                                src={el?.url}
                                                alt=""
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="drawer-form-product--btn">
                                <button type="submit">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </DrawerCpn>
            </div>
        </LoadingItem>
    );
}

export default withBase(memo(AdminProduct));
