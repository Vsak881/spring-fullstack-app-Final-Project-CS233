# NEXUS — E-Commerce Platform
### CS233 Final Project

A full-stack e-commerce web app built with Spring Boot, PostgreSQL, and JavaScript.

Live Site: [spring-fullstack-app-final-project-cs233-production.up.railway.app](https://spring-fullstack-app-final-project-cs233-production.up.railway.app)

GitHub: [github.com/Vsak881/spring-fullstack-app-Final-Project-CS233](https://github.com/Vsak881/spring-fullstack-app-Final-Project-CS233)

---

## How to Use

### As a Buyer
1. Go to the live site
2. Register a new account and select **Buy **
3. Browse products on the home page
4. Filter by category (Electronics, Clothing, Accessories)
5. Click **Add to Cart** on any product
6. Go to **Cart** → click **Place Order**
7. View your orders under **Orders**

### As a Seller
1. Register a new account and select **Sell**
2. After login, click **My Store** in the navbar
3. Fill in product details and upload an image
4. Click **Add Product** — it will appear in the store
5. Delete your own products from **My Store**

### As an Admin
1. Login with the admin account below
2. Click **Admin** in the navbar
3. View all products, orders, and users

---

## Test Accounts

| Role        | Email                    | Password     | Username  |
|-------------|--------------------------|--------------|-----------|
| 👑 Admin    | seng.vireaksak@gmail.com | 1Vireaksak1$ | Vireaksak |
| 🛒 Customer | abc@gmail.com            | 6767         | abc       |
| 🛒 Customer | tim@gmail.com            | timtimtim    | tim       |
| 🏪 Seller   | sok@gmail.com            | Sok121212    | sok       |
| 🏪 Seller   | death@gmail.com          | deathdeath   | death     |
| 🏪 Seller   | life@gmail.com           | lifelife     | life      |

---

## Tech Stack

- **Backend:** Spring Boot 3.5.11 (Java 17)
- **Database:** PostgreSQL (hosted on Railway)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Images:** Cloudinary
- **Deployment:** Railway (Docker)

---

## Database Structure

| Table         | Description                            |
|---------------|----------------------------------------|
| `users`       | Stores all user accounts with roles    |
| `products`    | Product listings with seller reference |
| `orders`      | Customer orders with status            |
| `order_items` | Individual items within each order     |
| `cart`        | Cart items per user                    |

---

## How to Deploy Locally

```bash
git clone https://github.com/Vsak881/spring-fullstack-app-Final-Project-CS233
cd spring-fullstack-app-Final-Project-CS233/demo
```

Update `src/main/resources/application.properties` with your PostgreSQL credentials, then run:

```bash
./mvnw spring-boot:run
```

Visit `http://localhost:8080`

---

## How to Deploy on Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Add a **PostgreSQL** service
4. Set **Root Directory** to `demo` in service settings
5. Railway auto-detects the Dockerfile and deploys automatically

---

