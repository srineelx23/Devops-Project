require('dotenv').config();  // Load environment variables from .env BEFORE requiring the app

const request = require('supertest');
const { app, client,server } = require('../server');  // Import both app and MongoDB client

let token;

describe("User API Tests (MongoDB Atlas)", () => {

  beforeAll(async () => {
    // Give server time to connect to Atlas
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  test("POST /user-api/user - Should create new user or show existing warning", async () => {
    const res = await request(app)
      .post(`/user-api/user`)
      .send({
        username: "testuser",
        password: "password123",
        email: "test@example.com"
      });

    expect(res.statusCode).toBe(200);
    expect(
      res.body.message === "user successfully created" ||
      res.body.message === "User already exists"
    ).toBe(true);
  });

  test("POST /user-api/login - Should return token for valid user", async () => {
    const res = await request(app)
      .post(`/user-api/login`)
      .send({
        username: "testuser",
        password: "password123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test("POST /user-api/add-purchase - Should insert purchase history", async () => {
    const res = await request(app)
      .post(`/user-api/add-purchase`)
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        username: "testuser",
        purchaseHistory: {
          purchase_name: 'Groceries',
          price: 120,
          category: 'Food',
          date: new Date().toISOString()
        }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("purchase inserted successfully");
  });

  test("POST /user-api/set-monthly-budget/:username - Should set monthly budget", async () => {
    const res = await request(app)
      .post(`/user-api/set-monthly-budget/testuser`)
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        budget: 5000,
        startDate: new Date().toISOString()
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Budget Updated");
  });

  test("GET /user-api/view-monthly-budget/:username - Should retrieve monthly budget", async () => {
    const res = await request(app)
      .get(`/user-api/view-monthly-budget/testuser`)
      .set(`Authorization`, `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('testuser');
  });

 afterAll(async () => {
  if (client) {
    await client.close(true);  // ✅ Forcefully close MongoDB pool
    console.log("Closed MongoDB connection");
  }
  if (server && server.close) {
    await server.close();
    console.log("Closed Express server");
  }
});

});
