import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User, preloadUsers } from "./models/Users.js";
import { UserStatus, preloadUserStatus } from "./models/UserStatus.js";
import { UserScopes, preloadUserScopes } from "./models/UserScopes.js";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    models: [User, UserStatus, UserScopes],
  }
);

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database is online");
    await sequelize.sync({ force: true });
    console.log("Database is synchronized");

    UserStatus.hasMany(User, { foreignKey: "user_status_id" });
    UserScopes.hasMany(User, { foreignKey: "user_scope_id" });
    User.belongsTo(UserScopes, { foreignKey: "user_scope_id" });
    User.belongsTo(UserStatus, { foreignKey: "user_status_id" });

    await preloadUserScopes();
    await preloadUserStatus();
    await preloadUsers();
  } catch (err) {
    throw new Error(err);
  }
}
