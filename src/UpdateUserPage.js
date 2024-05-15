import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';

class UpdateUserPage extends Component {
    constructor(props) {
        super(props);
        const { user } = props.location.state || { user: null }; // Provide default value for user if props.location.state is null
        this.state = {
            userName: user ? user.userName : '',
            email: user ? user.email : '',
            phoneNumber: user ? user.phoneNumber : '',
            userType: user ? user.userType : '',
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // Implement update logic here, such as making an API call to update user information
        console.log("Updated user information:", this.state);
    }

    render() {
        return (
            <div>
                <h2>Update User Information</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="userName">Username:</label>
                        <input type="text" id="userName" name="userName" value={this.state.userName} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" value={this.state.phoneNumber} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="userType">User Type:</label>
                        <input type="text" id="userType" name="userType" value={this.state.userType} onChange={this.handleChange} />
                    </div>
                    <button type="submit">Update</button>
                </form>
            </div>
        );
    }
}

// Use of functional component with hook
const UpdateUserPageWithLocation = () => {
    const location = useLocation();
    return <UpdateUserPage location={location} />;
}

export default UpdateUserPageWithLocation;
