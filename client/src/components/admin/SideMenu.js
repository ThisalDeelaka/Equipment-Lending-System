import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, ConfigProvider } from "antd";
import styles from "./SideMenu.module.css";

// Helper function to create a menu item object
function getItem(label, key, icon) {
    return {
        key,
        icon,
        label,
    };
}

// Array of menu items for the sidebar
const items = [
    getItem("Dashboard", "/admin", <Icon icon="material-symbols:dashboard-outline" />),
    getItem("Manage Equipment", "/admin/manage-equipment", <Icon icon="ic:outline-inventory" />),
    getItem("Manage Bookings", "/admin/manage-booking", <Icon icon="akar-icons:book" />),
];

// Keys of submenu items that have children, used to manage open states
const rootSubmenuKeys = ["sub1", "sub2", "sub3"];

function SideMenu() {
    const location = useLocation();  // Get current location (URL path)
    const navigate = useNavigate();  // Navigate programmatically to different routes
    const [openKeys, setOpenKeys] = useState(["/admin"]);  // State for open submenus
    const [selectedKeys, setSelectedKeys] = useState("/admin");  // State for selected menu item

    // Update selected menu item based on current URL path
    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    // Handle submenu opening/closing
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <div className={styles.sideMenu}>
            {/* Sidebar "Farmcart" logo text */}
            <div className={styles.logoContainer}>
                <h1 className={styles.logoText}>Farm</h1>
            </div>

            {/* Sidebar Menu */}
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#27ae61",
                    },
                    components: {
                        Menu: {
                            iconSize: "24px",
                            itemHeight: "48px",
                            subMenuItemBg: "#f5f5f5",
                        },
                    },
                }}
            >
                <Menu
                    mode="inline"
                    openKeys={openKeys}
                    selectedKeys={[selectedKeys]}
                    onOpenChange={onOpenChange}
                    onClick={(item) => navigate(item.key)}
                    className={styles.menu}
                    items={items}
                    theme="light"
                />
            </ConfigProvider>
        </div>
    );
}

export default SideMenu;
