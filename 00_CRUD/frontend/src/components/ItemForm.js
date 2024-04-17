import React, { useState } from "react";
import axios from "axios";

const ItemForm = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/items", {
                name,
                description,
            });
            setName("");
            setDescription("");
            onSubmit();
            console.log("Item criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar item:", error);
        }
    };

    return (
        <div>
            <h2>Criar Item</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Descrição:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Criar</button>
            </form>
        </div>
    );
};

export default ItemForm;
