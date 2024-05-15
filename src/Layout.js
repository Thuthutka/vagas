// Layout.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ isLoggedIn, setIsLoggedIn, user, children }) => {
    return (
        <div className="App container">
            <h3 className="d-flex justify-content-center m-3">Baigiamiasis</h3>

            {isLoggedIn && (
                <div className="text-center">
                    Logged in as: {user && user.email}
                </div>
            )}

            <nav className="navbar navbar-expand bg-light navbar-dark">
                <ul className="navbar-nav">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/home">
                                    Home
                                </NavLink>
                            </li>
                            <li className='nav-item m-1'>
                                <NavLink className="btn btn-light btn-outline" to="/dashboard">
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/ticketPage">
                                    Ticket Page
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/categorypage">
                                    Category Page
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/createTicket">
                                    Create Ticket
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/UserPage">
                                    User Page
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/updateUser">
                                    Update User
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <button className="btn btn-light btn-outline" onClick={() => setIsLoggedIn(false)}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/register">
                                    Register
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink className="btn btn-light btn-outline" to="/login">
                                    Login
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div>
                {children}
            </div>
        </div>
    );
};

export default Layout;
