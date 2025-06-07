const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User.models")
console.log("User model:", User);

describe("Auth Controller", () => {
    describe("POST /auth/signup", () => {

        beforeEach(async () => {
            await User.deleteMany();
        });

        const newUser = {
            name: "testUser",
            password: "Password123",
            email: "test@example.com"
        }

        it("should return 200 and create a new user", async () => {

            const res = await request(app)
                .post("/auth/signup")
                .send(newUser)
                .set("content-type", "application/json");

            expect(res.status).toBe(201);
            expect(res.body.user).toMatchObject({
                name: newUser.name,
                email: newUser.email,
            }
            )
            expect(res.body.user).not.toHaveProperty("password")
        })

        it("should not create user if fields are missing", async () => {
            const res = await request(app)
                .post("/auth/signup")
                .send({
                    email: "",
                    name: "",
                    password: "",
                })
                .set("content-type", "application/json");

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Provide email, password and name")
        });

        it("should not allowed invalid email formats", async () => {
            const res = await request(app)
                .post("/auth/signup")
                .send({
                    email: "myEmail.com",
                    name: "test",
                    password: "Password123",
                })
                .set("content-type", "application/json");

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Provide a valid email address.')
        });

        it("should require a strong password", async () => {
            const res = await request(app)
                .post("/auth/signup")
                .send({
                    email: "email@example.com",
                    name: "mimi",
                    password: "abc123",
                })
                .set("content-type", "application/json");

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.');
        });

        it("should return 400 if user already exists", async () => {
            // Create user first
            await User.create({
              name: newUser.name,
              email: newUser.email,
              password: newUser.password // assuming plain password, or hashed
            });
        
            const res = await request(app)
              .post("/auth/signup")
              .send(newUser)
              .set("Content-Type", "application/json");
        
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists.");
          });
        
    })
})