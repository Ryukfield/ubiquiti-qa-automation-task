import fs from "node:fs";
import path from "node:path";
import express from "express";

import { initialBook } from "./data/bookData.js";

const app = express();
app.use(express.json());

const directoryPath = import.meta.dirname;
const PORT = 3000;
const DB_FILE = path.join(directoryPath, "db.json");

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([initialBook], null, 2));
        return [initialBook];
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
};

const writeDB = (data) => {
    // null, 2 - needed for pretty formatting JSON with indentation
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// 1. [GET] /books - Get all books
app.get("/books", (_req, res) => {
    const books = readDB();
    res.json(books);
});

// 2. [GET] /books/:id - Get a book by ID
app.get("/books/:id", (req, res) => {
    const books = readDB();
    const book = books.find((b) => b.id === parseInt(req.params.id, 10));
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
});

// 3. [POST] /books - Add a new book
app.post("/books", (req, res) => {
    const books = readDB();
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        ...req.body,
    };

    books.push(newBook);
    writeDB(books);

    res.status(201).json(newBook);
});

// 4. [PUT] /books/:id - Update book information
app.put("/books/:id", (req, res) => {
    const books = readDB();
    const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id, 10));

    if (bookIndex === -1) return res.status(404).json({ error: "Book not found" });

    const { name, author, year, available } = req.body;

    if (name) books[bookIndex].name = name;
    if (author) books[bookIndex].author = author;
    if (year) books[bookIndex].year = year;
    if (available !== undefined) books[bookIndex].available = available;

    writeDB(books);

    res.json(books[bookIndex]);
});

// 5. [DELETE] /books/:id - Delete a book
app.delete("/books/:id", (req, res) => {
    const books = readDB();
    const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id, 10));

    if (bookIndex === -1) return res.status(404).json({ error: "Book not found" });

    books.splice(bookIndex, 1);
    writeDB(books); // <- Save changes to the file!

    res.status(200).json({ message: "Book deleted" });
});

// Healthcheck endpoint for Playwright webServer
app.get("/", (_req, res) => {
    res.status(200).send("API is alive");
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    console.log(`Database is stored in: ${DB_FILE}`);
});
