import React, { Component } from 'react';
import { variables } from './Variables';
import axios from 'axios'; // For making HTTP requests

export class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: "",
            Password: "",
            Email: "",
            PhoneNumber: "",
            UserType: 0,
            TicketId: "",
            error: ""
        };
    }

    handleChange = (e) => {
        const value = e.target.type === 'select-one' ? parseInt(e.target.value) : e.target.value;
        this.setState({
            [e.target.name]: value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { Name, Password, Email, PhoneNumber, UserType, TicketId } = this.state;
    
    // Create a new user object
    const newUser = {
        
        Name: Name,
        Password: Password,
        Email: Email,
        PhoneNumber: PhoneNumber,
        UserType: 0,
        TicketId: [] // Assuming TicketId is optional
         
    };

        axios.post(variables.API_URL + "Authentication/Register", newUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('User created successfully!', response.data);
            // Optionally, you can redirect to login page or do something else after successful registration
        })
        .catch(error => {
            if (error.response) {
                console.error('Error creating user:', error.response.data);
                this.setState({ error: error.response.data.errors[0] });
            } else {
                console.error('Error creating user:', error.message);
                this.setState({ error: "An error occurred while registering. Please try again later." });
            }
        });
    }

    render() {
        const { Name, Password, Email, PhoneNumber, UserType, TicketId, error } = this.state;
    
        return (
            <div>
                <h2>Registration</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="Name" name="Name" value={Name} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="Password" name="Password" value={Password} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="Email" name="Email" value={Email} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="text" className="form-control" id="PhoneNuber" name="PhoneNumber" value={PhoneNumber} onChange={this.handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        );
    }
}