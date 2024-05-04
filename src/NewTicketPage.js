import React, { Component } from 'react';
import { variables } from './Variables';
import axios from 'axios';

export class NewTicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketName: "",
            description: "",
            ticketImageUrl: "",
            ticketCategory: "",
            ticketPriority: 0,
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
        const { ticketName, description, ticketImageUrl, ticketCategory, ticketPriority } = this.state;
        
        // Create a new ticket object
        const newTicket = {
            ticketName,
            description,
            ticketImageUrl,
            ticketCreateDate: new Date().toISOString(),
            ticketCategory,
            ticketPriority
        };
    
        // Send a POST request to your API
        axios.post(variables.API_URL + "Tickets", newTicket, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Ticket created successfully!', response.data);
            // Clear form fields after successful submission
            this.setState({
                ticketName: "",
                description: "",
                ticketImageUrl: "",
                ticketCategory: "",
                ticketPriority: 0
            });
        })
        .catch(error => {
            console.error('Error creating ticket:', error.response.data);
        });
    }

    render() {
        const { ticketName, description, ticketImageUrl, ticketCategory, ticketPriority } = this.state;

        return (
            <div>
                <h2>Create New Ticket</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="ticketName" className="form-label">Ticket Name</label>
                        <input type="text" className="form-control" id="TicketName" name="ticketName" value={ticketName} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" name="description" value={description} onChange={this.handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ticketImageUrl" className="form-label">Ticket Image URL</label>
                        <input type="text" className="form-control" id="ticketImageUrl" name="ticketImageUrl" value={ticketImageUrl} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ticketCategory" className="form-label">Ticket Category</label>
                        <input type="text" className="form-control" id="ticketCategory" name="ticketCategory" value={ticketCategory} onChange={this.handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ticketPriority" className="form-label">Ticket Priority</label>
                        <select className="form-select" id="ticketPriority" name="ticketPriority" value={ticketPriority} onChange={this.handleChange}>
                            <option value={0}>Low</option>
                            <option value={1}>Medium</option>
                            <option value={2}>High</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}