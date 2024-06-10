import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { ScopeNames } from "../constants.js";

@Table({
  tableName: "user_scopes",
  timestamps: true,
})
export class UserScopes extends Model<UserScopes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  public user_scope_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(ScopeNames)),
    allowNull: false,
  })
  public scope!: ScopeNames;
}

export async function preloadUserScopes() {
  const count = await UserScopes.count();

  if (count == 0) {
    await UserScopes.bulkCreate([
      { scope: ScopeNames.ONLY_READ },
      { scope: ScopeNames.ADMIN },
    ]);
  } else {
    console.log("Table user_scopes is already poblated!");
  }
}
