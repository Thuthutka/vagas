import React, { Component } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import JWT decode library
import { variables } from './Variables';
import { useNavigate } from 'react-router-dom/dist';

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true,
            error: null,
            editable: false, // Track whether fields are editable or not
            userName: '',
            email: '',
            phoneNumber: '',
            userType: 0,
            TicketId: '',
            currentPassword: '', // State to store current password
            newPassword: '', // State to store new password
            showModal: false // State to control the modal visibility
        };
    }

    componentDidMount() {
        // Decode JWT token to get user ID
        const token = localStorage.getItem('token'); // Assuming you store the token in local storage
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;

        // Fetch user information when the component mounts
        this.fetchUser(userId);
    }

    fetchUser = (userId) => {
        axios.get(variables.API_URL + `Authentication/User/${userId}`)
            .then(response => {
                const { userName, email, phoneNumber, userType, TicketId } = response.data;
                this.setState({
                    user: response.data,
                    loading: false,
                    error: null,
                    userName,
                    email,
                    phoneNumber,
                    userType,
                });
            })
            .catch(error => {
                this.setState({
                    user: null,
                    loading: false,
                    error: "Error fetching user information."
                });
            });
    }

    handleEdit = () => {
        this.setState({ editable: true });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSave = () => {
        // Send updated user information to backend API
        const { user, newPassword } = this.state;
        axios.put(variables.API_URL + `Authentication/User/${user.id}`, {
            userName: this.state.userName,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            userType: this.state.userType,
            TicketId: [],
            Password: newPassword, // Include new password
        })
        .then(response => {
            // Update user state with the updated information
            this.setState({ user: response.data, editable: false });
        })
        .catch(error => {
            console.error('Error updating user:', error);
            // Handle error
        });
    }

    handleDelete = () => {
        this.setState({ showModal: true });
    }

    confirmDelete = () => {
        const { user } = this.state;
        const token = localStorage.getItem('token'); // Get the token from local storage

        axios.delete(variables.API_URL + `Authentication/User/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        })
        .then(response => {
            console.log('User deleted successfully', response.data);
            this.setState({ showModal: false });
            localStorage.removeItem('token'); // Remove the token from local storage
            this.props.navigate('/home'); // Redirect to home page
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            this.setState({ showModal: false });
        });
    }

    cancelDelete = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { user, loading, error, editable, userName, email, phoneNumber, userType, currentPassword, newPassword, showModal } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <div>
                <h2>User Information</h2>
                <div>
                    <strong>ID: </strong> {user.id}<br />
                    <strong>Username: </strong> 
                    {editable ? (
                        <input type="text" name="userName" value={userName} onChange={this.handleChange} />
                    ) : (
                        <span>{userName}</span>
                    )}
                    <br />
                    <strong>Email: </strong> 
                    {editable ? (
                        <input type="email" name="email" value={email} onChange={this.handleChange} />
                    ) : (
                        <span>{email}</span>
                    )}
                    <br />
                    <strong>Phone Number: </strong> 
                    {editable ? (
                        <input type="text" name="phoneNumber" value={phoneNumber} onChange={this.handleChange} />
                    ) : (
                        <span>{phoneNumber}</span>
                    )}
                    <br />
                    <strong>User Type: </strong> 
                    {editable ? (
                        <input type="text" name="userType" value={userType} onChange={this.handleChange} />
                    ) : (
                        <span>{userType}</span>
                    )}
                    <br />
                    {editable && (
                        <div>
                            <strong>Current Password:</strong> 
                            <input type="password" name="currentPassword" value={currentPassword} onChange={this.handleChange} />
                            <br />
                            <strong>New Password:</strong> 
                            <input type="password" name="newPassword" value={newPassword} onChange={this.handleChange} />
                            <br />
                        </div>
                    )}
                </div>
                {!editable && (
                    <button onClick={this.handleEdit}>Edit</button>
                )}
                {editable && (
                    <button onClick={this.handleSave}>Save</button>
                )}
                <button onClick={this.handleDelete}>Delete User</button>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Are you sure you want to delete your account?</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                <button onClick={this.confirmDelete}>Yes</button>
                                <button onClick={this.cancelDelete}>No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const UserPageWithNavigate = (props) => {
    const navigate = useNavigate();
    return <UserPage {...props} navigate={navigate} />;
};

export default UserPageWithNavigate;
