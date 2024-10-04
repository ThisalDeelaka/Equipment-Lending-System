import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, ConfigProvider } from "antd";
import styles from "./SideMenu.module.css";

function getItem(label, key, icon) {
    return {
        key,
        icon,
        label,
    };
}

const items = [
    getItem("Dashboard", "/admin", <Icon icon="material-symbols:dashboard-outline" className={styles.icon} />),
    getItem("Manage Equipment", "/admin/manage-equipment", <Icon icon="ic:outline-inventory" className={styles.icon} />),
    getItem("Manage Bookings", "/admin/manage-booking", <Icon icon="akar-icons:book" className={styles.icon} />),
];

function SideMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedKeys, setSelectedKeys] = useState("/admin");

    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    return (
        <div className={styles.sidebar}>
            <h2 className={styles.logo}>Farm Dashboard</h2>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#EFBF04",
                    },
                    components: {
                        Menu: {
                            iconSize: "24px",
                            itemHeight: "48px",
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKeys]}
                    onClick={(item) => navigate(item.key)}
                    className={styles.menu}
                    items={items}
                    theme="dark"
                />
            </ConfigProvider>
        </div>
    );
}

export default SideMenu;
