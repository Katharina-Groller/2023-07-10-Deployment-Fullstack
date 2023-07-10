const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { User } = require("../model/user.model");

describe("User Router", () => {
    beforeAll(async () => {
        // Vor allen Tests: Lösche alle vorhandenen User aus der Datenbank
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Nach allen Tests: Trenne die Datenbankverbindung
        await mongoose.disconnect();
    });

    describe("POST /signup", () => {
        it("should create a new user and return user data", async () => {
            const userData = {
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
            };

            const response = await request(app)
                .post("/users/signup")
                .send(userData)
                .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.username).toBe(userData.username);
            expect(response.body.email).toBe(userData.email);
        });
    });

    describe("POST /login", () => {
        it("should authenticate a user and return user data", async () => {
            const credentials = {
                username: "testuser",
                password: "testpassword",
            };

            const response = await request(app)
                .post("/users/login")
                .send(credentials)
                .expect(200);

            expect(response.body).toBeDefined();
            expect(response.body.username).toBe(credentials.username);
            expect(response.body.email).toBeDefined();
            expect(response.body.password).toBeUndefined();
        });

        it("should return an error for invalid credentials", async () => {
            const credentials = {
                username: "testuser",
                password: "wrongpassword",
            };

            const response = await request(app)
                .post("/users/login")
                .send(credentials)
                .expect(400);

            expect(response.body).toBeDefined();
            expect(response.body.messages).toBe("Invalid username or password");
        });
    });
});
