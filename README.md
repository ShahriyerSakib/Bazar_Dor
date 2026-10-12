# 🛒 Bazar Dor — Daily Market Price Tracker

A modern web application designed to help users explore daily market prices and product information through an API-powered interface.

## 🌐 Live Website

🔗 **Visit Bazar Dor:** [https://ebazardor.netlify.app](https://ebazardor.netlify.app)

Explore the live website to see the project in action.

## ✨ Features

- 📊 **Market Price Information** — Retrieve market product and price data through an external API.
- 🛍️ **Product Browsing** — Explore available products.
- 🗂️ **Category-Based Navigation** — Browse products by category where supported by the API.
- 🔐 **User Authentication** — Email and password authentication with Better Auth.
- 🌍 **Social Login** — Optional Google and GitHub authentication.
- 📱 **Responsive UI** — A user-friendly interface for different screen sizes.
- 🗄️ **Database Integration** — MongoDB integration for authentication data.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | Web framework |
| React | UI development |
| TypeScript | Type-safe development |
| Better Auth | Authentication |
| MongoDB | Database |
| MongoDB Node.js Driver | Database connectivity |
| Bazar Dor API | Market product and price data |

## 🚀 Run Locally

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd bazar-dor
```

Replace `<YOUR_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI="your_mongodb_connection_string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_secure_random_secret"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

BAZARDOR_API_URL="your_market_price_api_url"
```

Replace the placeholder values with your actual configuration. Google and GitHub credentials are needed only if you enable those providers.

**Security:** Never commit `.env.local` or publish database passwords, API keys, or authentication secrets.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

Bazar Dor uses Better Auth for email and password authentication, with MongoDB as its database. Google and GitHub sign-in can be configured using the appropriate OAuth credentials.

Authentication requires a working MongoDB connection and valid environment variables.

## 📡 Market Price API

Market product and price information is retrieved from an external API configured through `BAZARDOR_API_URL`.

The displayed data depends on the API response and the application's data-mapping logic.

## 🧰 Available Scripts

Check `package.json` for the scripts configured in your project. Typical Next.js commands include:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 🗺️ Future Improvements

- 🔎 Product search and filtering
- 📈 Historical price comparison
- 💰 Lowest-price highlights
- ❤️ Favorite products and shopping lists
- 👤 User profile and dashboard
- 🧪 Automated testing and improved error handling

## 👨‍💻 Developer

Developed as a learning project using modern web development technologies.

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under an open-source license.
