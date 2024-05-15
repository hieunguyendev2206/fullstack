import React, {memo, useEffect, useState} from "react";
import {AiOutlineDelete} from "react-icons/ai";
import Tabble from "../../common/Tabble/Tabble";
import LoadingItem from "../../Loading/LoadingItem";
import {deleteOrder, getOrders, updateStatusOrder} from "../../../api/order";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import {formatNumber} from "../../../helper/format";
import {fetchProduct} from "../../../redux/slice/productSlice";
import withBase from "../../../hocs/withBase";

function AdminOrder({dispatch}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const res = await getOrders();

            if (res.success) {
                if (res.success) {
                    const processedData = res.response.map((item) => ({
                        id: item._id,
                        name: item.user.name,
                        phone: item.user.phone,
                        address: item.user.address,
                        price: item.totalPrice,
                        payments: item.payments,
                        status: item.status,
                        product: item.products,
                    }));
                    setData(processedData);
                }
            }
        } catch (e) {
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            Header: "ID",
            accessor: "id",
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: "Phone",
            accessor: "phone",
        },
        {
            Header: "Address",
            accessor: "address",
        },
        {
            Header: "Product",
            accessor: "product",
            Cell: ({value}) => (
                <div style={{display: "flex", flexDirection: "column"}}>
                    {value?.map((product, index) => (
                        <div key={index} style={{marginBottom: "10px"}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <img
                                    src={product?.product?.image[0]?.url}
                                    alt=""
                                    style={{width: "50px", height: "50px", marginRight: "8px"}}
                                />
                                <div>
                                    <p style={{padding: "0", margin: "0"}}>
                                        {product?.product?.name}
                                    </p>
                                    <p style={{padding: "0", margin: "0"}}>
                                        Quantity: {product?.quantity}
                                    </p>
                                    <p style={{padding: "0", margin: "0"}}>
                                        Color: {product?.color}
                                    </p>
                                </div>
                            </div>
                            <br/>
                        </div>
                    ))}
                </div>
            ),
        },

        {
            Header: "Price",
            accessor: "price",
            Cell: ({value}) => <p>{formatNumber(value)}</p>,
        },
        {
            Header: "Payment",
            accessor: "payments",
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({row}) => (
                <div className="">
                    {row.values.status === "Đã hủy" || row.values.status === "Đã giao" ? (
                        <span>{row.values.status}</span>
                    ) : (
                        <select
                            defaultValue={row.values?.status}
                            onChange={(e) => handleStatusChange(e, row.values)}
                        >
                            <option>{row.values.status}</option>
                            {row.values.status === "Chờ xử lý" && (
                                <option value="Đã chuyển hàng">Đã chuyển hàng</option>
                            )}
                            {row.values.status === "Đã chuyển hàng" && (
                                <option value="Đã giao">Đã giao</option>
                            )}
                        </select>
                    )}
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
                </div>
            ),
        },
    ];
    const handleStatusChange = async (e, values) => {
        try {
            const value = e.target.value;
            const {id} = values;
            setLoading(true);
            const res = await updateStatusOrder(id, {status: value});
            setLoading(false);
            if (res.success) {
                toast.success("Cập nhật trạng thái thành công");
                fetchData();
                dispatch(fetchProduct());
            }
        } catch (e) {
            setLoading(fetch);
            console.log(e);
        }
    };
    const handleDelete = async (data) => {
        try {
            const {id} = data.values;
            if (
                data?.values?.payments === "online" &&
                data?.values?.status === "Chờ xử lý"
            )
                return toast.warning("Bạn không thể xóa đơn hàng này");
            Swal.fire({
                title: "Bạn có muốn xóa đơn hàng này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    const res = await deleteOrder(id);
                    setLoading(false);
                    if (res?.success) {
                        toast.success(res?.mes);
                        fetchData();
                        Swal.fire("Đã xóa!", "", "Thành công");
                    }
                }
            });
        } catch (e) {
        }
    };
    return (
        <div>
            <LoadingItem isLoading={loading}>
                <div className="product-admin">
                    <div style={{height: "90vh", overflowY: "scroll"}}>
                        <Tabble title="Sản phẩm" data={data || []} columns={columns}/>
                    </div>
                </div>
            </LoadingItem>
        </div>
    );
}

export default withBase(memo(AdminOrder));
