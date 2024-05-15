import React, { Component } from 'react';
import { variables } from './Variables';
import axios from 'axios'; // For making HTTP requests
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // For decoding JWT token
import PropTypes from 'prop-types'; // For prop type validation

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            Password: "",
            error: "",
            user: null,
            loading: false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { Email, Password } = this.state;

        const loginData = {
            Email,
            Password
        };

        axios.post(variables.API_URL + "Authentication/Login", loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Login successful!', response.data);
            localStorage.setItem('token', response.data.token);

            const decodedToken = jwtDecode(response.data.token);
            const userId = decodedToken.Id;

            this.fetchUser(userId);

        })
        .catch(error => {
            if (error.response) {
                console.error('Error logging in:', error.response.data);
                this.setState({ error: "Invalid credentials. Please try again." });
            } else {
                console.error('Error logging in:', error.message);
                this.setState({ error: "An error occurred while logging in. Please try again later." });
            }
        });
    }

    fetchUser = (userId) => {
        this.setState({ loading: true });

        const token = localStorage.getItem('token'); // Get the token from local storage

        axios.get(variables.API_URL + `Authentication/User/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        })
        .then(response => {
            const { userName, email, phoneNumber, userType, TicketId } = response.data;
            const userData = {
                userName,
                email,
                phoneNumber,
                userType,
                TicketId
            };

            this.props.onLogin(userData);

            this.setState({
                user: response.data,
                loading: false,
                error: null
            });

            this.props.navigate('/dashboard'); // Navigate to the homepage after successful login
        })
        .catch(error => {
            console.error('Error fetching user information:', error); // Log the detailed error
            this.setState({
                user: null,
                loading: false,
                error: "Error fetching user information."
            });
        });
    }

    render() {
        const { Email, Password, error } = this.state;

        return (
            <div className="container mt-5">
                <h2 className="mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="Email" name="Email" value={Email} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="Password" name="Password" value={Password} onChange={this.handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        );
    }
}

// Define a higher-order component to wrap the Login component with the useNavigate hook
const LoginWithNavigate = (props) => {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

Login.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default LoginWithNavigate;
