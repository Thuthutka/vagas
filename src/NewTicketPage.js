import React, { Component } from 'react';
import { variables } from './Variables';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'

export class NewTicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TicketName: "",
            description: "",
            ticketImageUrl: "",
            ticketCategory: "",
            ticketSubCategory: "",
            ticketPriority: 0,
            categoryOptions: [],
            subCategoryOptions: [],
            selectedCategoryId: "",
            selectedCategoryPriority: 0,
            selectedSubCategoryPriority: 0 // Added state to store the selected category ID
        };
    }

    componentDidMount() {
        // Fetch all categories and store their names and IDs
        this.fetchCategories();
    }

    fetchCategories() {
        axios.get(variables.API_URL + "TicketCategory")
            .then(response => {
                const categories = response.data.map(category => ({
                    id: category.ticketCategoryId,
                    name: category.name,
                    ticketPriority: category.ticketPriority
                }));
                this.setState({ categoryOptions: categories });
            })
            .catch(error => {
                console.error('Error fetching ticket categories:', error);
            });
    }

    fetchSubCategories(categoryId) {
        console.log(`${variables.API_URL}TicketCategory/${categoryId}`)
        // Fetch subcategories for the selected category ID
        axios.get(`${variables.API_URL}TicketCategory/${categoryId}`)
            .then(response => {
                console.log(response.data)
                const subcategories = response.data.ticketSubCategories || []; // Use empty array if subcategories is undefined
                const formattedSubcategories = subcategories.map(subcategory => ({
                    id: subcategory.ticketSubCategoryId,
                    name: subcategory.name,
                    ticketPriority: subcategory.ticketPriority
                }));

                // Find the selected category priority
                const selectedCategory = this.state.categoryOptions.find(cat => cat.id === categoryId);
                const selectedCategoryPriority = selectedCategory ? selectedCategory.ticketPriority : 0;

                // Update the state with the fetched subcategories and category priority
                this.setState({
                    subCategoryOptions: formattedSubcategories,
                    ticketSubCategory: "", // Reset the selected subcategory
                    selectedCategoryPriority: selectedCategoryPriority // Update selected category priority
                }, this.calculatePriority);
            })
            .catch(error => {
                console.error('Error fetching subcategories:', error);
            });
    }

    calculatePriority = () => {
        const { selectedCategoryPriority, selectedSubCategoryPriority } = this.state;
        let ticketPriority = 0;

        if (selectedCategoryPriority === 2 && selectedSubCategoryPriority === 2) {
            ticketPriority = 3;
        } else if (
            (selectedCategoryPriority === 2 && selectedSubCategoryPriority === 1) ||
            (selectedCategoryPriority === 1 && selectedSubCategoryPriority === 2)
        ) {
            ticketPriority = 2;
        } else if (
            (selectedCategoryPriority === 2 && selectedSubCategoryPriority === 0) ||
            (selectedCategoryPriority === 1 && selectedSubCategoryPriority === 1) ||
            (selectedCategoryPriority === 0 && selectedSubCategoryPriority === 2)
        ) {
            ticketPriority = 1;
        } else {
            ticketPriority = 0;
        }

        this.setState({ ticketPriority });
    }

    handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state
        this.setState({
            [name]: value
        });

        // Fetch subcategory options based on selected category
        if (name === 'ticketCategory') {
            this.fetchSubCategories(value);
        }

        if (name === 'ticketSubCategory') {
            const selectedSubCategory = this.state.subCategoryOptions.find(sub => sub.id === value);
            const selectedSubCategoryPriority = selectedSubCategory ? selectedSubCategory.ticketPriority : 0;
            this.setState({
                selectedSubCategoryPriority: selectedSubCategoryPriority // Update selected subcategory priority
            }, this.calculatePriority);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
    
        // Extract the data from the state
        const { TicketName, description, ticketImageUrl, ticketCategory, ticketSubCategory, ticketPriority } = this.state;    
        // Get user ID from JWT token
        //console.log(userId)
        const token = localStorage.getItem('token'); // Assuming the JWT token is stored in local storage
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.Id;
    
        // Create a payload object with the form data and user ID
        const formData = {
            ticketName: TicketName,
            description: description,
            ticketImageUrl: ticketImageUrl,
            ticketCreateDate: new Date().toISOString(), // Current date and time
            ticketCategory: ticketCategory,
            ticketSubCategory: ticketSubCategory,
            answer: "",
            ticketStatus: 0,
            ticketPriority: ticketPriority,
            userIds: userId ? [userId] : []// User ID extracted from JWT token
        };
    
        // Make a POST request to the backend API
        axios.post(variables.API_URL + 'Tickets', formData)
            .then(response => {
                // Handle success
                console.log('Ticket created successfully:', response.data);
                // You might want to redirect or show a success message here
            })
            .catch(error => {
                // Handle error
                console.error('Error creating ticket:', error);
                // You might want to display an error message to the user
            });
    }

    render() {
        const { TicketName, description, ticketImageUrl, ticketCategory, ticketSubCategory, ticketPriority, categoryOptions, subCategoryOptions, selectedCategoryId } = this.state;

        return (
            <div>
            <h2>Create New Ticket</h2>
            <form onSubmit={this.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="TicketName" className="form-label">Ticket Name</label>
                    <input type="text" className="form-control" id="TicketName" name="TicketName" value={TicketName} onChange={this.handleChange} />
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
                    <select className="form-select" id="ticketCategory" name="ticketCategory" value={ticketCategory} onChange={this.handleChange}>
                        <option value="">Select Category</option>
                        {categoryOptions.map((category, index) => (
                            <option key={index} value={category.id}>{category.name} (ID: {category.id})</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="ticketSubCategory" className="form-label">Ticket Subcategory</label>
                    <select className="form-select" id="ticketSubCategory" name="ticketSubCategory" value={ticketSubCategory} onChange={this.handleChange}>
                        <option value="">Select Subcategory</option>
                        {subCategoryOptions.map((subcategory, index) => (
                            <option key={index} value={subcategory.id}>{subcategory.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="ticketPriority" className="form-label">Ticket Priority</label>
                    <input type="text" className="form-control" id="ticketPriority" name="ticketPriority" value={ticketPriority} readOnly />
                </div>
                <div className="mb-3">
                    <p>Selected Category ID: {selectedCategoryId}</p>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        );
    }
}
