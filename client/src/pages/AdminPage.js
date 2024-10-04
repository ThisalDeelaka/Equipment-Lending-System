import React, { useEffect, useState } from "react";
import SideMenu from "../components/admin/SideMenu";
import NavBar from "../components/admin/NavBar";
import AdminRoutes from "../components/AdminRoutes";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import styles from "./AdminPage.module.css";

function AdminPage() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.dashboardContainer}>
                    <div className={styles.sideMenuAndContent}>
                        <div className={styles.sidebarContainer}>
                            <SideMenu />
                        </div>
                        <div className={styles.pageContent}>
                            <NavBar />
                            <AdminRoutes />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminPage;