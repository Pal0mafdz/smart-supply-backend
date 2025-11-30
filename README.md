# Smart Supply - Backend 🧠📡

RESTful API powering the **Smart Supply** platform. It handles business logic, database management, authentication, and AI services for restaurant management.

## 🚀 Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
* **Authentication:** JWT validation middleware (Auth0).
* **AI:** Agent integration for suppliers (`supplierAgent.ts`).

## ⚙️ API Capabilities

The backend exposes endpoints to manage the following resources:

* **Auth & Users:** Profile and role management (`MyUserController`).
* **Inventory:** Products (`MyProductController`), Categories, and Movements.
* **Recipes:** Cost logic and ingredient linking (`RecipeController`).
* **Operations:**
    * **Sales:** Recording and analysis (`SaleController`).
    * **Orders:** Order status management (`OrderController`).
    * **Tables:** Status and occupancy (`TableController`).
    * **Cash Register:** Session opening and closing (`CashSessionController`).
* **Suppliers:** Management and AI agent (`AiSupplierController`).

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <REPOSITORY_URL>
    cd smart-supply-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory with the following variables:

    ```env
    PORT=4000
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart-supply
    AUTH0_ISSUER_BASE_URL=[https://your-domain.auth0.com/](https://your-domain.auth0.com/)
    AUTH0_AUDIENCE=your-api-audience
    OPENAI_API_KEY=sk-... (If using OpenAI for the supplier agent)
    ```

4.  **Build and Run:**

    * **Development (with auto-reload):**
        ```bash
        npm run dev
        ```
    * **Production:**
        ```bash
        npm run build
        npm start
        ```

## 📂 Data Models (MongoDB)

Main schemas can be found in `/src/models`:
* `User`: Employee data and roles.
* `Product` & `Ingredient`: Base inventory.
* `Recipe`: Dishes composed of products/ingredients.
* `Order` & `Sale`: Transactions.
* `CashSession`: Cash flow control.

---
