import React, { useState, useEffect } from 'react';
import { getItems, createItem } from '../services/api';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await getItems();
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching items:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createItem(newItem);
            setNewItem({ name: '', description: '', price: '' });
            fetchItems(); // Refresh list
        } catch (error) {
            console.error("Error creating item:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>Item Manager</h1>

            <div className="card">
                <h2>Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="number"
                            placeholder="Price"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Add Item</button>
                </form>
            </div>

            <div className="card">
                <h2>Items List</h2>
                {items.length === 0 ? (
                    <p>No items found.</p>
                ) : (
                    <ul>
                        {items.map((item) => (
                            <li key={item.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <strong>{item.name}</strong> - ${item.price}
                                <p>{item.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ItemList;
