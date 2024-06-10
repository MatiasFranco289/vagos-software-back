import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { StatusNames } from "../constants.js";
import { User } from "./Users.js";

@Table({
  tableName: "user_status",
  timestamps: true,
})
export class UserStatus extends Model<UserStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  public user_status_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(StatusNames)),
    allowNull: false,
  })
  public status!: StatusNames;
}

export async function preloadUserStatus() {
  const count = await UserStatus.count();

  if (count == 0) {
    UserStatus.bulkCreate([
      { status: StatusNames.DEFAULT },
      { status: StatusNames.BANNED },
    ]);
  } else {
    console.log("Table user_status is already poblated!");
  }
}
