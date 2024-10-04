import React, { useState, useEffect } from "react";
import {
    Button,
    Dropdown,
    Space,
    Avatar,
    ConfigProvider,
    Grid,
    theme,
} from "antd";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import styles from "./NavBarUser.module.css";

const { useToken } = theme;
const { useBreakpoint } = Grid;

function NavBarUser() {
    const { token } = useToken();
    const screens = useBreakpoint();
    const [user, setUser] = useState(null);
    const defaultProfilePic =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/1200px-Windows_10_Default_Profile_Picture.svg.png";

    useEffect(() => {
        const fetchUserByID = async () => {
            const userJSON = localStorage.getItem("currentUser");

            if (!userJSON) {
                console.error("User not found in localStorage.");
                return;
            }

            const user = JSON.parse(userJSON);
            setUser(user);

            if (!user || !user.userID) {
                console.error("Invalid user object or userID not found.");
                return;
            }
        };

        fetchUserByID();
    }, []);

    function logout() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("selectedCategory");
        window.location.href = "/login";
    }

    const items = [
        {
            label: (
                <a href="/profile">My Account</a>
            ),
            key: "0",
        },
        user &&
            user.userType === "Admin" && {
                label: (
                    <a href="/admin">Admin</a>
                ),
                key: "admin",
            },
        {
            label: (
                <a href="/login" onClick={logout}>Log Out</a>
            ),
            key: "2",
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#27ae61",
                },
            }}
        >
            <nav className={styles.header}>
                <div className={styles.container}>
                    <Link to="/" className={styles.logo}>
                        FarmCart
                    </Link>
                    {user ? (
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()} className={styles.userMenu}>
                                <Avatar size={30} src={user.profilePic || defaultProfilePic} className={styles.userAvatar} />
                                <span>{user.username}</span>
                                <Icon icon="gridicons:dropdown" className={styles.dropdownIcon} />
                            </a>
                        </Dropdown>
                    ) : (
                        <Space className={styles.buttonGroup}>
                            {screens.md && (
                                <Link to="/login">
                                    <Button className={styles.button}>Log in</Button>
                                </Link>
                            )}
                            <Link to="/signup">
                                <Button className={styles.button}>Sign up</Button>
                            </Link>
                        </Space>
                    )}
                </div>
            </nav>
        </ConfigProvider>
    );
}

export default NavBarUser;