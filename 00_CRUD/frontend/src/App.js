import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import ItemList from "./components/ItemList";
import ItemForm from "./components/ItemForm";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/items">
                        <ItemList />
                    </Route>
                    <Route path="/create-item">
                        <ItemForm />
                    </Route>
                    <Route path="/edit-item/:id">
                        <ItemForm />
                    </Route>
                    <Route path="/detail-item/:id">
                        {/* Componente para exibir detalhes do item */}
                    </Route>
                    <Route path="/">
                        {/* Componente padrão, pode ser redirecionado para uma página de boas-vindas */}
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
