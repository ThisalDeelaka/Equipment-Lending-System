import React, { useEffect, useState } from "react";
import { Button, Dropdown, Space, Avatar, ConfigProvider } from "antd";
import { Icon } from "@iconify/react";
import styles from "./NavBar.module.css";

const items = [
    {
        label: (
            <a
                className={styles.navLink}
                rel="noopener noreferrer"
                href="/"
            >
                Home
            </a>
        ),
        key: "2",
    },
    {
        type: "divider",
    },
    {
        label: (
            <a
                className={styles.navLink}
                rel="noopener noreferrer"
                href="/profile"
            >
                Profile
            </a>
        ),
        key: "0",
    },
    {
        type: "divider",
    },
    {
        label: (
            <a
                className={styles.navLink}
                rel="noopener noreferrer"
                onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.href = "/login";
                }}
            >
                Log Out
            </a>
        ),
        key: "1",
    },
];

function NavBar() {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user?.userType !== "Admin") {
            window.location.href = "/home";
        }
        setLoggedUser(user);
    }, []);

    return (
        <>
            {loggedUser && (
                <div className={styles.navBar}>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#EFBF04",
                            },
                        }}
                    >
                        <Space className={styles.leftIcons}>
                            <Icon icon="material-symbols:dashboard-outline" className={styles.navIcon} />
                        </Space>

                        <Space className={styles.rightSection}>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                            >
                                <a
                                    onClick={(e) => e.preventDefault()}
                                    className={styles.userProfile}
                                >
                                    <Space>
                                        <Avatar size={30} />
                                        {loggedUser.username}
                                        <Icon icon="gridicons:dropdown" />
                                    </Space>
                                </a>
                            </Dropdown>
                        </Space>
                    </ConfigProvider>
                </div>
            )}
        </>
    );
}

export default NavBar;
