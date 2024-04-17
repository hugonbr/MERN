import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/items");
                setItems(response.data);
            } catch (error) {
                console.error("Erro ao obter itens:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <h2>Lista de Itens</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong>: {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
