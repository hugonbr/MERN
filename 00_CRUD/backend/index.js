const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const app = express();
const port = 5000;

// Configuração do MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "crud_auth",
});

// Conectar ao MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Conectado ao MySQL");
});

// Middleware para análise de corpo JSON
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
    res.send("Backend do CRUD com autenticação de usuário está funcionando!");
});

// Rota de registro de usuário
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = { username, password: hashedPassword };

    db.query("INSERT INTO users SET ?", user, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Erro ao registrar usuário." });
        } else {
            res.status(201).send({
                message: "Usuário registrado com sucesso.",
            });
        }
    });
});

// Rota de login de usuário
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
            if (err) {
                res.status(500).send({ message: "Erro ao fazer login." });
            } else if (results.length === 0) {
                res.status(401).send({ message: "Usuário não encontrado." });
            } else {
                const user = results[0];
                const passwordMatch = bcrypt.compareSync(
                    password,
                    user.password
                );
                if (passwordMatch) {
                    const token = jwt.sign(
                        { username: user.username },
                        "1020304050",
                        { expiresIn: "1h" }
                    );
                    res.status(200).send({
                        message: "Login bem-sucedido.",
                        token,
                    });
                } else {
                    res.status(401).send({ message: "Credenciais inválidas." });
                }
            }
        }
    );
});

// Middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res
            .status(403)
            .send({ auth: false, message: "Token não fornecido." });
    }

    jwt.verify(token, "seu_segredo", (err, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({ auth: false, message: "Falha ao autenticar o token." });
        }
        req.username = decoded.username;
        next();
    });
};

// Rota protegida para verificar se o usuário está autenticado
app.get("/verify", verifyToken, (req, res) => {
    res.status(200).send({ auth: true, message: "Token válido." });
});

// CRUD de itens

// Rota para obter todos os itens
app.get("/items", verifyToken, (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) {
            res.status(500).send({ message: "Erro ao obter itens." });
        } else {
            res.status(200).send(results);
        }
    });
});

// Rota para obter um único item pelo ID
app.get("/items/:id", verifyToken, (req, res) => {
    const itemId = req.params.id;
    db.query("SELECT * FROM items WHERE id = ?", [itemId], (err, results) => {
        if (err) {
            res.status(500).send({ message: "Erro ao obter item." });
        } else if (results.length === 0) {
            res.status(404).send({ message: "Item não encontrado." });
        } else {
            res.status(200).send(results[0]);
        }
    });
});

// Rota para criar um novo item
app.post("/items", verifyToken, (req, res) => {
    const { name, description } = req.body;
    const item = { name, description };

    db.query("INSERT INTO items SET ?", item, (err, result) => {
        if (err) {
            res.status(500).send({ message: "Erro ao criar item." });
        } else {
            res.status(201).send({ message: "Item criado com sucesso." });
        }
    });
});

// Rota para atualizar um item existente
app.put("/items/:id", verifyToken, (req, res) => {
    const itemId = req.params.id;
    const { name, description } = req.body;
    const updatedItem = { name, description };

    db.query(
        "UPDATE items SET ? WHERE id = ?",
        [updatedItem, itemId],
        (err, result) => {
            if (err) {
                res.status(500).send({ message: "Erro ao atualizar item." });
            } else {
                res.status(200).send({
                    message: "Item atualizado com sucesso.",
                });
            }
        }
    );
});

// Rota para excluir um item
app.delete("/items/:id", verifyToken, (req, res) => {
    const itemId = req.params.id;

    db.query("DELETE FROM items WHERE id = ?", [itemId], (err, result) => {
        if (err) {
            res.status(500).send({ message: "Erro ao excluir item." });
        } else {
            res.status(200).send({ message: "Item excluído com sucesso." });
        }
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
