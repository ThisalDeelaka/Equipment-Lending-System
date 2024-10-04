import React, { useState } from "react";
import Navbar from '../components/CommonComponents/Navbar';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const validateForm = () => {
        const { firstName, lastName, email, username, password, confirmPassword, agreeToTerms } = formData;

        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            message.error('Please fill in all required fields.');
            return false;
        }

        if (password !== confirmPassword) {
            message.error('Passwords do not match.');
            return false;
        }

        if (!agreeToTerms) {
            message.error('You must agree to the terms and conditions.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('/api/users/signup', formData);

            if (response.status === 201) {
                message.success(response.data.message);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                navigate('/');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    agreeToTerms: false,
                });
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message);
            } else {
                message.error('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.signupPageMainContainer}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Sign up</h2>
                    <p className={styles.subtitle}>Enter your credentials to continue</p>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                className={styles.input}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className={styles.input}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className={styles.input}
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className={styles.input}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className={styles.input}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                id="terms"
                                className={styles.checkbox}
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="terms" className={styles.termsLabel}>
                                I agree to all the <span className={styles.termsLink}>Terms</span> and <span className={styles.termsLink}>Privacy Policies</span>
                            </label>
                        </div>
                        <button type="submit" className={styles.signupButton}>Create account</button>
                        <p className={styles.loginText}>Already have an account? <a href="#" className={styles.loginLink}>Login</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;