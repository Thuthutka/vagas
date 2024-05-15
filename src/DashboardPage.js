import React, { Component } from 'react';
import { variables } from './Variables';
import { Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure you have installed this package

export class DashboardPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            tickets: [],
            loading: true,
        };
    }

    refreshList() {
        fetch(variables.API_URL + "Tickets")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const userTickets = data.filter(ticket => Array.isArray(ticket.userIds) && ticket.userIds.includes(this.state.userId));
                this.setState({ tickets: userTickets, loading: false });
            }).catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ loading: false });
            });
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.Id;
            this.setState({ userId: userId }, () => {
                this.refreshList();
            });
        } else {
            this.setState({ loading: false });
            console.error('No token found');
        }
    }

    render() {
        const {
            tickets,
            loading,
        } = this.state;

        const statusLabels = ["Open", "Closed"];
        const statusClasses = ["text-primary", "text-secondary"];

        return (
            <div>
                <h2>My Tickets</h2>

                <Link to="/createTicket" className='btn btn-primary m-2 float-end'>
                    Add Ticket
                </Link>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>Ticket Name</th>
                                <th>Description</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket =>
                                <tr key={ticket.ticketId}>
                                    <td>{ticket.ticketName}</td>
                                    <td>{ticket.description}</td>
                                    <td className={statusClasses[ticket.status]}>
                                        {statusLabels[ticket.status]}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
}
