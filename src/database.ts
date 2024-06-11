import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User, preloadUsers } from "./models/Users.js";
import { UserStatus, preloadUserStatus } from "./models/UserStatus.js";
import { UserScopes, preloadUserScopes } from "./models/UserScopes.js";
import { Tags } from "./models/Tags.js";
import { Projects } from "./models/Projects.js";
import { ProjectStatus } from "./models/ProjectStatus.js";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    models: [User, UserStatus, UserScopes, Projects, Tags, ProjectStatus],
  }
);

export async function initDB() {
  try {
    await sequelize.authenticate();
    console.log("Database is online");
    await sequelize.sync({ force: true });
    console.log("Database is synchronized");

    User.belongsTo(UserStatus, { foreignKey: "user_status_id" });
    UserStatus.hasMany(User, { foreignKey: "user_status_id" });

    User.belongsTo(UserScopes, { foreignKey: "user_scope_id" });
    UserScopes.hasMany(User, { foreignKey: "user_scope_id" });

    Projects.belongsTo(Tags, { foreignKey: "tag_id" });
    Tags.hasMany(Projects, { foreignKey: "tag_id" });

    Projects.belongsTo(ProjectStatus, { foreignKey: "project_status_id" });
    ProjectStatus.hasMany(Projects, { foreignKey: "project_status_id" });

    Projects.belongsTo(User, { foreignKey: "created_by" });
    User.hasMany(Projects, { foreignKey: "created_by" });

    await preloadUserScopes();
    await preloadUserStatus();
    await preloadUsers();
  } catch (err) {
    throw new Error(err);
  }
}
