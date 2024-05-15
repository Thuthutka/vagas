import React, { useState, useEffect } from 'react';
import { variables } from './Variables';
import { useParams } from 'react-router-dom'; // Import useParams hook

export const CategoryDetailPage = () => {
  const { id } = useParams(); // Get category ID from URL params using useParams hook

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(variables.API_URL + "TicketCategory/" + id)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch category details');
        }
        return response.json();
      })
      .then(data => {
        setCategory(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching category details:', error);
        setLoading(false);
      });
  }, [id]); // Trigger useEffect when the id changes

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!category) {
    return <div style={styles.notFound}>Category not found</div>;
  }

  return (
    <div style={styles.categoryDetails}>
      <h2 style={styles.title}>Category Details</h2>
      <div style={styles.content}>
        <p><strong>ID:</strong> {category.ticketCategoryId}</p>
        <p><strong>Name:</strong> {category.name}</p>
        <p><strong>Priority:</strong> {category.ticketPriority}</p>
        <p><strong>Subcategories:</strong></p>
        <ul style={styles.subcategoriesList}>
          {category.ticketSubCategories.map(subcategory => (
            <li key={subcategory.ticketSubCategoryId} style={styles.subcategoryItem}>
              <span>{subcategory.ticketSubCategoryId}</span> - <span>Name: {subcategory.name}</span> - <span>Priority: {subcategory.ticketPriority}</span> 
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  loading: {
    fontSize: '18px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    textAlign: 'center'
  },
  notFound: {
    fontSize: '18px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    textAlign: 'center'
  },
  categoryDetails: {
    margin: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: '24px',
    marginBottom: '15px'
  },
  content: {
    fontSize: '16px'
  },
  subcategoriesList: {
    listStyleType: 'none',
    padding: '0'
  },
  subcategoryItem: {
    marginBottom: '10px'
  }
};
