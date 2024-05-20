import React from "react";
import AdminContent from "../../components/Admin/AdminContent/AdminContent";
import "./AdminPage.scss";
import Footter from "../../components/footer/Footer";

function AdminPage() {
    return (
        <div className="Adminpage">
            <AdminContent/>
            <Footter/>
        </div>
    );
}

export default AdminPage;
