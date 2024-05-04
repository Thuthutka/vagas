import React, { Component } from 'react';
import { variables } from './Variables';
import axios from 'axios'; // For making HTTP requests

export class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            UserPassword: "",
            UserEmail: "",
            UserPhone: ""
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
        const { UserName, UserPassword, UserEmail, UserPhone } = this.state;
        
        // Create a new user object
        const newUser = {
            UserName,
            UserPassword,
            UserEmail,
            UserPhone
        };

        axios.post(variables.API_URL + "Employee", newUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('User created successfully!', response);
            // Clear form fields after successful submission
            this.setState({
                UserName: "",
                UserPassword: "",
                UserEmail: "",
                UserPhone: ""
            });
        })
        .catch(error => {
            if (error.response) {
                console.error('Error creating user:', error.response.data);
            } else {
                console.error('Error creating user:', error.message);
            }
        });
    }

    render() {
        const { UserName, UserPassword, UserEmail, UserPhone, error } = this.state;
    
        return (
            <div>
                <h2>Registration</h2>
                {error && <div className="error">{error}</div>}
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="UserName" name="UserName" value={UserName} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="UserPassword" name="UserPassword" value={UserPassword} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="UserEmail" name="UserEmail" value={UserEmail} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text" className="form-control" id="UserPhone" name="UserPhone" value={UserPhone} onChange={this.handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        );
    }
}
