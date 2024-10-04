import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.row}>
                    <div className={styles.footerCol}>
                        <h4>Company</h4>
                        <ul>
                            <li>
                                <Link to="/">about us</Link>
                            </li>
                            <li>
                                <Link to="/">our services</Link>
                            </li>
                            <li>
                                <Link to="/">privacy policy</Link>
                            </li>
                            <li>
                                <Link to="/feedbacks">feedbacks</Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div className={styles.footerCol}>
                        <h4>Book Now</h4>
                        <ul>
                            <li>
                                <Link to="/rooms">Ticket</Link>
                            </li>
                            <li>
                                <Link to="/events">Events</Link>
                            </li>
                            <li>
                                <Link to="/parking">Parking</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.footerCol}>
                        <h4>follow us</h4>
                        <div className={styles.socialLinks}>
                            <Link to="#">
                                <Icon icon="ic:baseline-facebook" />
                            </Link>
                            <Link to="#">
                                <Icon icon="mdi:instagram" />
                            </Link>
                            <Link to="#">
                                <Icon icon="mdi:twitter" />
                            </Link>
                            <Link to="#">
                                <Icon icon="mdi:linkedin" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;