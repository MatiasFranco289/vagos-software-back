import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { userRoute } from "./routes/User.js";
import { initDB } from "./database.js";

// TODO: Documentar en README.md
// TODO: Hacer que los endpoints no exploten a la minima
// Load .env vars
dotenv.config();

// Setup app and port
const app = express();
const port: string = process.env.PORT || "3000";

// Setup CORS policies
// TODO: Check if the CORS its working correctly and you can't do request from others domains.
const whiteList = ["http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Setup for SESSION variables
// TODO: Make this secure when deploying
app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 6000000,
    },
  })
);

//DB initialization
initDB();

// Adding routes
app.use("/users", userRoute);

// Init the app
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
