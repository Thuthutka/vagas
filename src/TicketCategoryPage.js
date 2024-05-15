import React, { Component } from 'react';
import { variables } from './Variables';
import { Link } from 'react-router-dom';

export class TicketCategoryPage extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            categories: [],
            loading: true,
            modalTitle: "",
            categoryName: "",
            categoryId: ""
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        fetch(variables.API_URL + "TicketCategory")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket categories');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ categories: data, loading: false });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.setState({ loading: false });
            });
    }

    changeCategoryName = (e) => {
        this.setState({ categoryName: e.target.value });
    }

    addClick = () => {
        this.setState({
            modalTitle: "Add Category",
            categoryId: "",
            categoryName: ""
        });
    }

    editClick = (category) => {
        this.setState({
            modalTitle: "Edit Category",
            categoryId: category.ticketCategoryId, // Update categoryId reference
            categoryName: category.name
        });
    }

    render() {
        const { categories, modalTitle, categoryName, categoryId } = this.state;

        return (
            <div>
                <Link to="/createCategory" className='btn btn-primary m-2 float-end'>
                    Add Category
                </Link>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Category Name</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
    {categories.map(category =>
        <tr key={category.ticketCategoryId}>
            <td>{category.ticketCategoryId}</td>
            <td>
                <Link to={`/category/${category.ticketCategoryId}`}>
                    {category.name}
                </Link>
            </td>
            <td>
                <button type='button' className='btn btn-light mr-1' onClick={() => this.editClick(category)}>
                    Edit
                </button>
                <button type='button' className='btn btn-light mr-1'>
                    Delete
                </button>
            </td>
        </tr>
    )}
</tbody>

                </table>

                <div className='modal fade' id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className='modal-dialog modal-lg modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{modalTitle}</h5>
                                <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label='Close'></button>
                            </div>
                            <div className='modal-body'>
                                <div className='input-group mb-3'>
                                    <span className='input-group-text'>Category Name</span>
                                    <input type='text' className='form-control'
                                        value={categoryName}
                                        onChange={this.changeCategoryName} />
                                </div>

                                {categoryId === "" ? (
                                    <button type="button" className="btn btn-primary float-start">Create</button>
                                ) : (
                                    <button type="button" className="btn btn-primary float-start">Update</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
