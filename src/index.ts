import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { userRoute } from "./routes/User.ts";
import { initDB } from "./database.ts";
import { projectRoute } from "./routes/Projects.ts";
import { projectStatusRoute } from "./routes/ProjectsStatus.ts";

// TODO: Cambiar el formato de los errores al usado en el helper
// TODO: Documentar en README.md
// Load .env vars
dotenv.config();

// Setup app and port
const app = express();
const port: string = process.env.PORT || "3000";

app.use(express.json());

// Setup CORS policies
const whiteList = process.env.WHITE_LIST.split(",");
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
      maxAge: 72 * 60 * 60 * 1000, // 72 hours
    },
  })
);

//DB initialization
initDB();

// Adding routes
app.use("/users", userRoute);
app.use("/projects", projectRoute);
app.use("/projects-status", projectStatusRoute);

// Init the app
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
