import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Hompage from "./pages/HomePage/Hompage.jsx";
import {fetchCategory} from "./redux/slice/categorySlice.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchProduct} from "./redux/slice/productSlice.js";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductInfor from "./pages/ProductPage/ProductInforPage/ProductInfor.jsx";
import LayoutAdmin from "./components/Admin/LayoutAdmin.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import Personal from "./pages/PersonalPage/Personal.jsx";
import Payment from "./pages/PaymentPage/Payment.jsx";
import Order from "./pages/OrderPage/Order.jsx";
import BlogInfor from "./pages/Blog/BlogInfor/BlogInfor.jsx";
import BlogPage from "./pages/Blog/BlogPage/BlogPage.jsx";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";

function App() {
    const {user} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const fetchdataCategory = async () => {
        dispatch(fetchCategory());
    };
    const fetchProducts = async () => {
        dispatch(fetchProduct());
    };

    useEffect(() => {
        fetchdataCategory();
        fetchProducts();
    }, []);
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Hompage/>
                            </Layout>
                        }
                    />
                    <Route
                        path="category/:category"
                        element={
                            <Layout>
                                <ProductPage/>
                            </Layout>
                        }
                    />
                    <Route path="/auth" element={<Auth/>}/>
                    <Route
                        path="/verify-email"
                        element={
                            <Layout>
                                <div className="content-verified-email">
                                    <VerifyEmailPage />
                                </div>
                            </Layout>
                        }
                    />
                    <Route
                        path="/product/:id"
                        element={
                            <Layout>
                                <ProductInfor/>
                            </Layout>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <Layout>
                                <Personal/>
                            </Layout>
                        }
                    />
                    <Route
                        path="/payment"
                        element={
                            <Layout>
                                <Payment/>
                            </Layout>
                        }
                    />
                    <Route
                        path="/order"
                        element={
                            <Layout>
                                <Order/>
                            </Layout>
                        }
                    />
                    <Route
                        path="/blog"
                        element={
                            <Layout>
                                <BlogPage/>
                            </Layout>
                        }
                    />
                    <Route
                        path="/blog/:id"
                        element={
                            <Layout>
                                <BlogInfor/>
                            </Layout>
                        }
                    />
                </Routes>

                {user && user?.role === "Admin" && (
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <LayoutAdmin>
                                    <AdminPage/>
                                </LayoutAdmin>
                            }
                        />
                    </Routes>
                )}
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;
