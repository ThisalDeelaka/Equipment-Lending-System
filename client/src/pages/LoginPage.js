import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import Navbar from "../components/CommonComponents/Navbar";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "/api/users/login",
                { email, password }
            );

            if (response.data.message === "Login successful") {
                message.success("Login Successful!");

                // Save user data to local storage
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(response.data.user)
                );

                if (response.data.user.userType === "Admin") {
                    // Navigate to the admin dashboard
                    navigate("/admin/");
                } else {
                    // Navigate to the home page
                    navigate("/");
                }
            } else {
                message.error("Login Failed. Check your credentials.");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.mainContainer}>
                <div className={styles.backgroundContainer}>
                    <div className={styles.formContainer}>
                        <form onSubmit={handleLogin}>
                            <div className={styles.titleContainer}>
                                <h2 className={styles.title}>Hi, Welcome Back</h2>
                                <p className={styles.subtitle}>Enter your credentials to continue</p>
                            </div>
                            <div className={styles.inputFieldsContainer}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles.inputEmail}
                                />
                                <div className={styles.passwordFieldContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className={styles.inputPassword}
                                    />
                                    <Icon
                                        path={showPassword ? mdiEyeOff : mdiEye}
                                        size={1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={styles.passwordToggleIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.rememberMeSection}>
                                <label>
                                    <input
                                        type="checkbox"
                                        style={{ marginRight: 5 }}
                                    />
                                    Remember me
                                </label>
                                <a href="/" className={styles.forgotPasswordLink}>
                                    Forgot Password?
                                </a>
                            </div>
                            <button type="submit" className={styles.loginButton}>
                                Login
                            </button>
                            <p className={styles.signupText}>
                                Don't have an account?{" "}
                                <a href="/" className={styles.signupLink}>
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;