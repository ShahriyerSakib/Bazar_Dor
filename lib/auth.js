import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Reuse one client across hot reloads / serverless invocations.
const globalForMongo = globalThis;
const client =
  globalForMongo._bazarMongo || new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/bazardor");
if (!globalForMongo._bazarMongo) globalForMongo._bazarMongo = client;
const db = client.db();

const social = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  social.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  social.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, // after sign up, send the user to the sign-in page
    minPasswordLength: 6,
  },
  socialProviders: social,
});
