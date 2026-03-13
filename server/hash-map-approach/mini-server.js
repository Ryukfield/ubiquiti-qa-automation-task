import fs from "node:fs";
import path from "node:path";
import express from "express";

import { initialBook } from "./data/bookCleanData.js";

/**
 * ALTERNATIVE IMPLEMENTATION (Hash Map Method)
 * * This is PoC version of the server.
 * Please note that functionality and compatibility with apiTest test is not guaranteed at this stage.
 * * Performance Optimization:
 * This approach will perform significantly faster than array-based iteration as the volume of data in db.json increases.
 */

const app = express();
app.use(express.json());

const directoryPath = import.meta.dirname;
const PORT = 3000;
const DB_FILE = path.join(directoryPath, "db.json");

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        const { id, ...bookData } = initialBook;
        const initialData = { [id]: bookData };
        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// 1. [GET] /books - Get all books as a Hash Map
app.get("/books", (_req, res) => {
    const books = readDB();
    res.json(books);
});

// 2. [GET] /books/:id - Get specific book details
app.get("/books/:id", (req, res) => {
    const books = readDB();
    const bookId = req.params.id;
    const book = books[bookId];

    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
});

// 3. [POST] /books - Add a new book
app.post("/books", (req, res) => {
    const books = readDB();

    const existingIds = Object.keys(books).map(Number);
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const { id, ...newBookData } = req.body;

    books[newId] = newBookData;
    writeDB(books);

    res.status(201).json({ [newId]: newBookData });
});

// 4. [PUT] /books/:id - Update book information
app.put("/books/:id", (req, res) => {
    const books = readDB();
    const bookId = req.params.id;

    if (!books[bookId]) return res.status(404).json({ error: "Book not found" });

    const { id, ...updateData } = req.body;
    books[bookId] = { ...books[bookId], ...updateData };

    writeDB(books);
    res.json(books[bookId]);
});

// 5. [DELETE] /books/:id - Delete a book
app.delete("/books/:id", (req, res) => {
    const books = readDB();
    const bookId = req.params.id;

    if (!books[bookId]) return res.status(404).json({ error: "Book not found" });

    delete books[bookId];
    writeDB(books);

    res.status(200).json({ message: "Book deleted" });
});

// Healthcheck endpoint
app.get("/", (_req, res) => {
    res.status(200).send("API is alive");
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    console.log(`Database is stored in (pure hash-map): ${DB_FILE}`);
});
