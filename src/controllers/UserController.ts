import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Load .env vars
dotenv.config();

// Creates a new instance of OAuth2
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

export const userController = {
  // TODO: This endpoint should enumerate all user endpoints
  get: (req: Request, res: Response) => {
    res.send("This is the users endpoint.");
  },

  get_login: async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    req.session.credentials = {
      ...oauth2Client.credentials,
      internalScopes: [],
    };
    res.sendStatus(200);
  },

  get_user_data: (req, res) => {
    const idToken = req.session.credentials.id_token;
    console.log(req.session.credentials);

    try {
      const decoded = jwt.decode(idToken);
      console.log(decoded);
      if (decoded) {
        res.send(decoded);
      } else {
        res.send(400);
      }
    } catch (err) {
      res.send(400);
    }
  },

  is_session_active: (req, res) => {
    const sessionStatus: boolean = req.session.credentials !== undefined;
    res.send(sessionStatus);
  },
};

// Crear una tabla usuarios
// Crear una tabla estados
// Cuando un usuario se logea, lo busco por su mail en la tabla
// Si esta en la tabla verifico su estado

// Si el estado es ADMIN se agrega a los internal scopes el estado de admin
// Si el estado es BANNED se agregaa los internal scopes

// Agregar endpoints:

//
