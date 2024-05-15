import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { Home } from './Home';
import { TicketPage } from './TicketPage';
import { NewTicketPage } from './NewTicketPage';
import { Registration } from './Registration';
import Login from './Login';
import UserPage from './UserPage';
import UpdateUserPage from './UpdateUserPage';
import { TicketCategoryPage } from './TicketCategoryPage';
import { CategoryDetailPage } from './CategoryDetailPage';
import { ToastContainer, toast } from 'react-toastify';
import { DashboardPage } from './DashboardPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // State to track user authentication status and user information
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Function to handle user login
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // Store user data in state
  
    // Trigger toast notification for successful login
    // toast.success('Login successful!', {
    //   position: toast.POSITION.TOP_CENTER
    // });
  };

  return (
    <BrowserRouter>
      <div className="App container">
        <h3 className="d-flex justify-content-center m-3">
          Baigiamiasis
        </h3>

        {/* Display user information if logged in */}
        {isLoggedIn && (
          <div className="text-center">
            Logged in as: {user && user.email} {/* Assuming user has an email property */}
          </div>
        )}

        <nav className="navbar navbar-expand bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item m-1">
              <NavLink className="btn btn-light btn-outline" to="/home">
                Home
              </NavLink>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item m-1">
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
                <NavLink className="btn btn-light btn-outline" to="/home">
                  <button className="btn btn-light btn-outline" onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </button>
                  </NavLink>
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

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ticketPage" element={<TicketPage />} />
          <Route path="/createTicket" element={<NewTicketPage />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/UserPage" element={<UserPage />} />
          <Route path="/updateUser" element={<UpdateUserPage />} />
          <Route path="/categorypage" element={<TicketCategoryPage />} />
          <Route path="/category/:id" element={<CategoryDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
        
        {/* Include ToastContainer to display toast notifications */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
