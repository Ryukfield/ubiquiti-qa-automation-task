import { expect, test } from "@playwright/test";
import { bookData } from "../utils/bookData";

test.describe("API Operations", () => {

    test("Complete book lifecycle (CRUD)", async ({ request }) => {
        let bookId: number;

        // --- STEP 1: CREATE ---
        await test.step("Create new book", async () => {
            const response = await request.post("/books", {
                data: bookData
            });
            expect(response.status()).toBe(201);

            const body = await response.json() as BookObjectTypeFromDatabase;
            expect(body.name).toBe(bookData.name);
            expect(body.id).toBeDefined();
            bookId = body.id;
        });

        // --- STEP 2: READ ---
        await test.step("Verify book is in the list", async () => {
            const response = await request.get("/books");
            expect(response.ok()).toBeTruthy();

            const books = await response.json() as BookObjectTypeFromDatabase[];
            expect(books.some((b) => b.id === bookId)).toBeTruthy();
        });

        // --- STEP 3: GET BY ID ---
        await test.step("Get specific book details", async () => {
            const response = await request.get(`/books/${bookId}`);
            expect(response.status()).toBe(200);

            const body = await response.json() as BookObjectTypeFromDatabase;
            expect(body.id).toBe(bookId);
            expect(body.author).toBe(bookData.author);
        });

        // --- STEP 4: UPDATE ---
        await test.step("Update book availability", async () => {
            const updateData = { available: 5 };
            const response = await request.put(`/books/${bookId}`, { data: updateData });
            expect(response.ok()).toBeTruthy();

            const body = await response.json() as BookObjectTypeFromDatabase;
            expect(body.available).toBe(5);
            expect(body.name).toBe(bookData.name);
        });

        // --- STEP 5: DELETE ---
        await test.step("Delete the book", async () => {
            const response = await request.delete(`/books/${bookId}`);
            expect(response.status()).toBe(200);

            const checkResponse = await request.get(`/books/${bookId}`);
            expect(checkResponse.status()).toBe(404);
        });
    });

    test("Negative: Should return 404 for non-existent book", async ({ request }) => {
        const response = await request.get("/books/999999");
        expect(response.status()).toBe(404);
    });
});
