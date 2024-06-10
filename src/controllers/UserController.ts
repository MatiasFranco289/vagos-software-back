import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/Users.js";
import { UserStatus } from "../models/UserStatus.js";
import { UserScopes } from "../models/UserScopes.js";
import { UserCredentials, ScopeNames, StatusNames } from "../constants.js";

// TODO: Deberias implementar una interfaz unificada para las respuestas

// Load .env vars
dotenv.config();

// Creates a new instance of OAuth2
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

function decode(myJwt: string) {
  let decoded: JwtPayload | string;

  try {
    decoded = jwt.decode(myJwt);

    if (!decoded) {
      console.error("Error while trying to decode.");
    }
  } catch (err) {
    console.error("Error while decoding: " + err);
  }

  return decoded;
}

export const userController = {
  // TODO: This endpoint should enumerate all user endpoints
  get: (req: Request, res: Response) => {
    res.send("This is the users endpoint.");
  },

  get_login: async (req, res) => {
    let statusCode: number = 200;

    // If already have a active session
    if (req.session.credentials) {
      statusCode = 409;
      return res.status(statusCode).send("The user is already connected.");
    }

    // Contact with OAuth to get client info
    const code: string | undefined = req.query.code as string;
    if (!code) {
      return res.status(400).send("Error, you must send a code.");
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
    } catch (err) {
      return res
        .status(500)
        .send(
          "Error, could not get user info. Check if the code is correct or try again."
        );
    }

    // Creates an object for the response
    const credentials: UserCredentials = {
      internalScopes: "",
      internalStatus: "",
      userInfo: {
        email: "",
        name: "",
        username: "",
        picture: "",
      },
    };

    // Decode the JWT received to get the user info
    const userInfo = decode(oauth2Client.credentials.id_token);

    // If the token was correctly decoded
    if (typeof userInfo !== "string") {
      // Save user info retrieved from OAuth2 API
      credentials.userInfo = {
        email: userInfo.email,
        name: userInfo.name,
        username: userInfo.given_name,
        picture: userInfo.picture,
      };

      // Find in the DB if the user is already saved
      const dbUser = await User.findOne({
        where: { email: userInfo.email },
        include: [{ model: UserStatus }, { model: UserScopes }],
      });

      // If the user already exist in the DB save the retrieved scopes and
      // status in the actual session
      if (dbUser) {
        statusCode = 200;

        credentials.internalScopes =
          dbUser.dataValues.UserScopes.dataValues.scope;

        credentials.internalStatus =
          dbUser.dataValues.UserStatus.dataValues.status;

        User.update(
          {
            email: credentials.userInfo.email,
            name: credentials.userInfo.name,
            user_name: credentials.userInfo.username,
            picture: credentials.userInfo.picture,
          },
          { where: { user_id: dbUser.dataValues.user_id } }
        );
      } else {
        // If the DB does not exist in the DB
        statusCode = 201;

        const status = await UserStatus.findOne({
          where: { status: StatusNames.DEFAULT },
        });
        const scope = await UserScopes.findOne({
          where: { scope: ScopeNames.ONLY_READ },
        });

        User.create({
          email: credentials.userInfo.email,
          name: credentials.userInfo.name,
          user_name: credentials.userInfo.username,
          picture: credentials.userInfo.picture,
          user_scope_id: scope.dataValues.user_scope_id,
          user_status_id: status.dataValues.user_status_id,
        });
      }

      req.session.credentials = credentials; // Saves the full info in a session variable
      res.sendStatus(statusCode);
    } else {
      statusCode = 500;
      res
        .status(statusCode)
        .json({ error: "Could not retrieve user information" });
    }
  },

  get_session_info: (req: Request, res: Response) => {
    // If there is an active session
    console.log(req.session);
    if (req.session.credentials) {
      return res.status(200).json(req.session.credentials);
    }

    res.status(401).json({ error: "No active session. Please log in." });
  },

  post_logout: (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Ocurrio un error!");
        return res.send("Me caigo a pedazos");
      }

      res.clearCookie("connect.sid");
      res.end();
    });
  },

  test_create_name: (req: Request, res: Response) => {
    req.session.name = "Pedro";
    res.status(200).send();
  },

  test_show_name: (req: Request, res: Response) => {
    res.status(200).send("The name is " + req.session.name);
  },

  test_delete_session: (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Ocurrio un error!");
        return res.send("Me caigo a pedazos");
      }
      res.clearCookie("connect.sid");
      res.end();
    });
  },
};
