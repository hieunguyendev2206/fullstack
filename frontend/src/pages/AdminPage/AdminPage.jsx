import React from "react";
import AdminContent from "../../components/Admin/AdminContent/AdminContent";
import "./AdminPage.scss";
import Footter from "../../components/footer/Footer";
import Header from "../../components/Admin/HeaderAdmin/HeaderAdmin";

function AdminPage() {
    return (
        <div className="Adminpage">
            <Header/>
            <AdminContent/>
            <Footter/>
        </div>
    );
}

export default AdminPage;
