import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { User } from "../models/Users.ts";
import { UserStatus } from "../models/UserStatus.ts";
import { UserScopes } from "../models/UserScopes.ts";
import {
  UserCredentials,
  ScopeNames,
  StatusNames,
  ApiResponse,
} from "../constants.ts";

// Load .env vars
dotenv.config();

// Creates a new instance of OAuth2
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

function decode(myJwt: string): string | JwtPayload {
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
  get: (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode: number = 200;
    let response: ApiResponse<null> = {
      code: statusCode,
      message: "Hi user!",
      data: [],
    };

    res.status(statusCode).json(response);
  },

  get_login: async (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode: number = 200;
    let response: ApiResponse<null>;

    // If already have a active session
    if (req.session.credentials) {
      statusCode = 409;
      response = {
        code: statusCode,
        message:
          "The user already has an active session. Use log out endpoint before try log in again.",
        data: [],
      };

      return res.status(statusCode).json(response);
    }

    // Checks if the code is in the user request query
    const code: string | undefined = req.query.code as string;
    if (!code) {
      statusCode = 400;
      response = {
        code: statusCode,
        message: "You must send the code provided by Auth2.",
        data: [],
      };

      return res.status(statusCode).json(response);
    }

    // Contact with OAuth to get client info
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
    } catch (err) {
      statusCode = 500;
      response = {
        code: statusCode,
        message:
          "Could not retrieve user info. Check the application logs for more information.",
        data: [],
      };

      return res.status(statusCode).json(response);
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
      response = {
        code: statusCode,
        message: "Loged in successfully.",
        data: [],
      };

      res.status(statusCode).json(response);
    } else {
      statusCode = 500;
      response = {
        code: statusCode,
        message: `Could not retrieve user information.
        Check application logs to get more information.`,
        data: [],
      };

      res.status(statusCode).json(response);
    }
  },

  get_session_info: (
    req: Request,
    res: Response<ApiResponse<UserCredentials | null>>
  ) => {
    // If there is an active session
    let statusCode: number;

    if (req.session.credentials) {
      statusCode = 200;

      let response: ApiResponse<UserCredentials> = {
        code: statusCode,
        message: "Session info successfully retrieved.",
        data: [req.session.credentials],
      };

      return res.status(statusCode).json(response);
    }

    statusCode = 401;

    let response: ApiResponse<null> = {
      code: statusCode,
      message: "No active session found. Please log in.",
      data: [],
    };

    res.status(statusCode).json(response);
  },

  post_logout: (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode: number = 200;

    // Attemps to destroy the current user session
    req.session.destroy((err) => {
      if (err) {
        console.error(
          "The following error has ocurred in the logout endpoint: " + err
        );

        statusCode = 500;
        let response: ApiResponse<null> = {
          code: statusCode,
          message: `An unexpected error has ocurred while trying 
            to destroy the current session. Check the 
            application logs for more info.`,
          data: [],
        };

        return res.status(statusCode).json(response);
      }
      res.clearCookie("connect.sid");

      statusCode = 200;
      let response: ApiResponse<null> = {
        code: statusCode,
        message: "The session has been successfully destroyed.",
        data: [],
      };

      res.status(statusCode).json(response);
    });
  },
};
