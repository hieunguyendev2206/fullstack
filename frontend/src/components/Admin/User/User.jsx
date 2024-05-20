import React, { useEffect, useState } from "react";
import Tabble from "../../common/Tabble/Tabble";
import * as UserApi from "../../../api/user.js";
import { AiOutlineDelete } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "./User.scss";

function User() {
    const [dataTable, setDataTable] = useState([]);

    const getUsers = async () => {
        try {
            const res = await UserApi.getUsers();
            if (res.success) {
                const data = res.users.map((el, index) => ({
                    id: el?._id,
                    Stt: index + 1,
                    name: el?.name,
                    email: el?.email,
                    phone: el?.phone,
                    address: el?.address,
                    profilePicture: el?.profilePicture,
                    role: el?.role,
                }));

                setDataTable(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const columns = [
        { Header: "STT", accessor: "Stt" },
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name" },
        { Header: "Email", accessor: "email" },
        { Header: "Phone", accessor: "phone" },
        { Header: "Address", accessor: "address" },
        {
            Header: "Image",
            accessor: "profilePicture",
            Cell: ({ value }) => (
                <img
                    src={value}
                    alt="Profile"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
            ),
        },
        {
            Header: "Role",
            accessor: "role"
        },
        {
            Header: "Actions",
            Cell: ({ row }) => (
                <div style={{ display: "flex" }}>
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
                        <AiOutlineDelete />
                    </span>
                    <span
                        onClick={() => handleUpdate(row)}
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
                        <FaPencilAlt />
                    </span>
                </div>
            ),
        },
    ];

    const handleDelete = async (data) => {
        try {
            const { id } = data.values;
            Swal.fire({
                title: "Bạn có muốn xóa người dùng này?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await UserApi.deleteUser(id);
                    if (res.success) {
                        Swal.fire("Đã xóa!", "", "Thành công");
                        getUsers();
                    } else {
                        console.error("Error deleting user:", res.message);
                        Swal.fire("Xóa thất bại!", res.message || "Có lỗi xảy ra", "error");
                    }
                }
            });
        } catch (err) {
            console.error("Error in handleDelete:", err);
            Swal.fire("Xóa thất bại!", err.message || "Có lỗi xảy ra", "error");
        }
    };

    const handleUpdate = async (data) => {
        const { id, name, email, phone, address, role } = data.values;
        const { value: formValues } = await Swal.fire({
            title: "Cập nhật thông tin người dùng",
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Tên" value="${name || ''}">
                <input id="swal-input2" class="swal2-input" placeholder="Email" value="${email || ''}">
                <input id="swal-input3" class="swal2-input" placeholder="Số điện thoại" value="${phone || ''}">
                <input id="swal-input4" class="swal2-input" placeholder="Địa chỉ" value="${address || ''}">
                <div>
                    <select style="margin-top: 10px" id="swal-input5" class="swal2-input">
                        <option value="User" ${role === "User" ? "selected" : ""}>User</option>
                        <option value="Admin" ${role === "Admin" ? "selected" : ""}>Admin</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                    document.getElementById("swal-input3").value,
                    document.getElementById("swal-input4").value,
                    document.getElementById("swal-input5").value,
                ];
            },
        });

        if (formValues) {
            const [updatedName, updatedEmail, updatedPhone, updateAddress, updatedRole] = formValues;
            console.log("Updating user with data:", {
                name: updatedName,
                email: updatedEmail,
                phone: updatedPhone,
                address: updateAddress,
                role: updatedRole,
            });
            try {
                const res = await UserApi.updateUserAdmin(id, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone,
                    address: updateAddress,
                    role: updatedRole,
                });
                if (res.success) {
                    Swal.fire("Cập nhật thành công!", "", "success");
                    getUsers();
                } else {
                    console.error("Error updating user:", res.message);
                    Swal.fire("Cập nhật thất bại!", res.message || "Có lỗi xảy ra", "error");
                }
            } catch (error) {
                console.error("Error in handleUpdate:", error);
                Swal.fire("Cập nhật thất bại!", error.message || "Có lỗi xảy ra trong quá trình cập nhật", "error");
            }
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="user">
            <Tabble title="Tất cả người dùng" data={dataTable} columns={columns} />
        </div>
    );
}

export default User;
