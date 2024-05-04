import logo from './logo.svg';
import './App.css';
import {Home} from './Home';
import {TicketPage} from './TicketPage';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { NewTicketPage } from './NewTicketPage';
import {Registration} from './Registration';

function App() {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        React JS Frontend
      </h3>

      <nav className="navbar navbar-expand- bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline" to="/home">
              Home
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline" to="/ticketPage">
              TicketPage
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/home' element={<Home />}/>
        <Route path='/ticketPage' element={<TicketPage />}/>
        <Route path='/createTicket' element={<NewTicketPage/>}/>
        <Route path='/register' element={<Registration />} /> {/* Route for the registration page */}
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
