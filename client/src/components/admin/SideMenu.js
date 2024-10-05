import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, ConfigProvider } from "antd";
import styles from "./SideMenu.module.css";
import logo from '../../assets/Logo/logo.jpg'; 

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
    getItem("Manage reservation", "/admin/manage-reservation", <Icon icon="akar-icons:book" className={styles.icon} />),
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
            {/* Replace the text with a logo image */}
            <img src={logo} alt="Logo" className={styles.logo} />
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
