import React, { Component } from 'react';
import { variables } from './Variables';
import { Link } from 'react-router-dom';

export class TicketPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tickets: [],
            modalTitle: "",
            ticketName: "",
            ticketId: "",
            loading: true,
            groupBy: 'none', // Added state to handle group by option
        };
    }

    refreshList() {
        fetch(variables.API_URL + "Tickets")
            .then(response => response.json())
            .then(data => {
                this.setState({ tickets: data, loading: false });
            }).catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ loading: false }); // Set loading to false in case of an error
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changeTicketName = (e) => {
        this.setState({ ticketName: e.target.value });
    }

    addClick() {
        this.setState({
            modalTitle: "Add Ticket",
            ticketId: "",
            ticketName: ""
        });
    }

    editClick(ticket) {
        this.setState({
            modalTitle: "Edit Ticket",
            ticketId: ticket.ticketId,
            ticketName: ticket.ticketName
        });
    }

    handleGroupByChange = (e) => {
        this.setState({ groupBy: e.target.value });
    }

    // Function to group tickets based on the selected attribute
    groupTickets(tickets, groupBy) {
        const criticalTickets = tickets.filter(ticket => ticket.ticketPriority === 3);
        const nonCriticalTickets = tickets.filter(ticket => ticket.ticketPriority !== 3);

        let groupedTickets = {};
        if (groupBy === 'none') {
            // Group by creation date
            groupedTickets = nonCriticalTickets.reduce((groups, ticket) => {
                const date = new Date(ticket.ticketCreateDate).toLocaleDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(ticket);
                return groups;
            }, {});
        } else {
            groupedTickets = nonCriticalTickets.reduce((groups, ticket) => {
                const key = groupBy === 'priority' ? ticket.ticketPriority : ticket.status;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(ticket);
                return groups;
            }, {});
        }

        return { criticalTickets, groupedTickets };
    }

    // Function to sort grouped tickets
    sortGroupedTickets(groupedTickets, groupBy) {
        const sortedKeys = Object.keys(groupedTickets).sort((a, b) => {
            if (groupBy === 'priority') {
                return b - a; // Higher priority first
            }
            if (groupBy === 'none') {
                // Sort dates in descending order
                return new Date(b) - new Date(a);
            }
            return 0;
        });

        return sortedKeys.reduce((sortedGroups, key) => {
            sortedGroups[key] = groupedTickets[key];
            return sortedGroups;
        }, {});
    }

    render() {
        const {
            tickets,
            modalTitle,
            ticketName,
            ticketId,
            groupBy
        } = this.state;

        // Priority labels and styles
        const priorityLabels = ["Low", "Medium", "High", "Critical"];
        const priorityClasses = ["text-secondary", "text-warning", "text-primary", "text-danger font-weight-bold"];

        // Group and sort tickets based on the selected group by option
        const { criticalTickets, groupedTickets } = this.groupTickets(tickets, groupBy);
        const sortedGroupedTickets = this.sortGroupedTickets(groupedTickets, groupBy);

        return (
            <div>
                <Link to="/createTicket" className='btn btn-primary m-2 float-end'>
                    Add Ticket
                </Link>
                <div className='mb-3'>
                    <label htmlFor="groupBy" className="form-label">Group By</label>
                    <select className="form-select" id="groupBy" value={groupBy} onChange={this.handleGroupByChange}>
                        <option value="none">None</option>
                        <option value="priority">Priority</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                {criticalTickets.length > 0 && (
                    <div>
                        <h3 className="mt-4 text-danger font-weight-bold">Critical</h3>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Ticket Name</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {criticalTickets.map(ticket =>
                                    <tr key={ticket.ticketId} className='table-danger'>
                                        <td>{ticket.ticketName}</td>
                                        <td>{ticket.description}</td>
                                        <td className={priorityClasses[ticket.ticketPriority]}>
                                            {priorityLabels[ticket.ticketPriority]}
                                        </td>
                                        <td>
                                            <button type='button' className='btn btn-light mr-1'
                                                data-bs-toggle='modal'
                                                data-bs-target='#exampleModal'
                                                onClick={() => this.editClick(ticket)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                                </svg>
                                            </button>

                                            <button type='button' className='btn btn-light mr-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                )}

                {Object.keys(sortedGroupedTickets).map(groupKey => (
                    <div key={groupKey}>
                        {groupKey && (
                            <h3 className={`mt-4 ${groupBy === 'priority' ? priorityClasses[groupKey] : ''}`}>
                                {groupBy === 'priority' ? priorityLabels[groupKey] : `Date: ${groupKey}`}
                            </h3>
                        )}
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>Ticket Name</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedGroupedTickets[groupKey].map(ticket =>
                                    <tr key={ticket.ticketId} className={ticket.ticketPriority === 3 ? 'table-danger' : ''}>
                                        <td>{ticket.ticketName}</td>
                                        <td>{ticket.description}</td>
                                        <td className={priorityClasses[ticket.ticketPriority]}>
                                            {priorityLabels[ticket.ticketPriority]}
                                        </td>
                                        <td>
                                            <button type='button' className='btn btn-light mr-1'
                                                data-bs-toggle='modal'
                                                data-bs-target='#exampleModal'
                                                onClick={() => this.editClick(ticket)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                                </svg>
                                            </button>

                                            <button type='button' className='btn btn-light mr-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                ))}

                <div className='modal fade' id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{modalTitle}</h5>
                                <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label='Close'>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>TicketName</span>
                                    <input type='text' className='form-control'
                                        value={ticketName}
                                        onChange={this.changeTicketName} />
                                </div>

                                {ticketId === "" ? (
                                    <button type="button"
                                        className="btn btn-primary float-start">Create</button>)
                                    : null
                                }

                                {ticketId !== "" ? (
                                    <button type="button"
                                        className="btn btn-primary float-start">Update</button>)
                                    : null
                                }

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
