import React, {memo, useEffect, useState} from "react";
import "./ManageBlog.scss";
import LoadingItem from "../../../Loading/LoadingItem";
import {CiCirclePlus} from "react-icons/ci";
import Tabble from "../../../common/Tabble/Tabble";
import {FaPencilAlt} from "react-icons/fa";
import {AiOutlineDelete} from "react-icons/ai";
import withBase from "../../../../hocs/withBase";
import {deleteBlog, getBlogs, updateBlog} from "../../../../api/blog";
import {toast} from "react-toastify";
import Swal from "sweetalert2";
import ModalCpn from "../../../common/Modal/ModalCpn";
import {IoMdClose} from "react-icons/io";
import Edittor from "../../../common/inputComponet/Edittor";

function ManageBlog({setActive}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const [image, setImage] = useState(null);

    const columns = [
        {
            Header: "id",
            accessor: "id",
        },
        {
            Header: "Title",
            accessor: "title",
        },
        {
            Header: "Content",
            accessor: "content",
            Cell: ({value}) => {
                const text = value?.slice(0, 99);
                return <div dangerouslySetInnerHTML={{__html: text}}></div>;
            },
        },
        {
            Header: "Avatar",
            accessor: "avatar",
            Cell: ({value}) => (
                <img src={value.url} alt="" style={{width: "80px", height: "80px", borderRadius: "10px"}}/>
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

    const fetchData = async () => {
        try {
            const res = await getBlogs();
            if (res.success) {
                setData(res?.blog);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const handleDelete = async (data) => {
        try {
            const {id} = data?.values;
            Swal.fire({
                title: "Bạn có muốn xóa tin tức này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        setLoading(true);
                        const res = await deleteBlog(id);
                        setLoading(false);
                        if (res?.success) {
                            fetchData();
                            toast.success(res?.mes);
                            Swal.fire("Đã xóa!", "", "Thành công");
                        }
                    }
                })
                .catch((e) => {
                    setLoading(false);
                    console.log(e);
                });
        } catch (err) {
            setLoading(false);
            console.error("An error occurred:", err);
        }
    };
    const handleOpenEdit = (data) => {
        setDataEdit(data?.values);
        setImage(data?.values?.avatar?.url);
        setIsEdit(true);
    };

    useEffect(() => {
        fetchData();
    }, []);
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                title: dataEdit?.title,
                avatar: image,
                content: dataEdit?.content,
            };

            setLoading(true);
            const res = await updateBlog(dataEdit.id, data);
            setLoading(false);

            if (res.success) {
                toast.success("Cập nhật thành công");
                setIsEdit(false);
                fetchData();
            }
        } catch (e) {
            setLoading(false);
            toast.warning(e?.response?.data?.mes);
        }
    };
    return (
        <LoadingItem isLoading={loading}>
            <div className="blog">
                <div className="blog--create">
                    <div className="blog--create--btn" onClick={() => setActive(8)}>
                        <CiCirclePlus size={24}/>
                        <p>Tạo mới</p>
                    </div>
                </div>
                <Tabble title="Danh mục sản phẩm" data={data || []} columns={columns}/>
            </div>
            <ModalCpn isOpen={isEdit}>
                <div className="ModalEdit">
                    <div className="ModalEdit--close" onClick={() => setIsEdit(false)}>
                        <IoMdClose size={24}/>;
                    </div>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="create--box--lable">
                            <label className="create--box--lable--name" htmlFor="">
                                Tiêu đề
                            </label>
                            <input
                                className="create--box--lable--input"
                                placeholder="Nhập tiêu đề bài viết"
                                required
                                type="text"
                                id="title"
                                value={dataEdit?.title}
                                onChange={(e) =>
                                    setDataEdit({...dataEdit, title: e.target.value})
                                }
                            />
                        </div>

                        <div className="">
                            <Edittor
                                value={dataEdit?.content}
                                setValue={(value) =>
                                    setDataEdit({
                                        ...dataEdit,
                                        content: value,
                                    })
                                }
                            />
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
                                disabled={!dataEdit?.title || !image}
                                type="submit"
                                className="create--submit--btn"
                            >
                                Tạo mới
                            </button>
                        </div>
                    </form>
                </div>
            </ModalCpn>
        </LoadingItem>
    );
}

export default withBase(memo(ManageBlog));
