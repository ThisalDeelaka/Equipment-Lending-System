import "./App.css";
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/CommonComponents/Navbar";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomeScreen from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserProfilePage from "./pages/UserProfilePage";
import BookingPage from "./pages/BookingPage"
import Footer from "./components/CommonComponents/Footer";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <BrowserRouter>
                <Routes>
                    <Route path="/admin/*" element={<AdminPage />} exact />
                    <Route path="/login" element={<LoginPage />} exact />
                    <Route path="/signup" element={<SignupPage />} exact />
                    <Route
                        path="/*"
                        element={
                            <>
                                <Navbar />
                                <div className="main-container-page">
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<HomeScreen />}
                                            exact
                                        />
                                        <Route
                                            path="/booking/:id"
                                            element={<BookingPage />}
                                            exact
                                        /> 
                                        <Route
                                            path="/profile"
                                            element={<UserProfilePage />}
                                            exact
                                        /> 
                                         <Route
                                            path="/eventDetails"
                                            element={<EventDetails />}
                                            exact
                                        />                                     
                                    </Routes>
                                    
                                </div>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
            </BrowserRouter>
  );
}

export default App;