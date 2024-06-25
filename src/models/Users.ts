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
import { UserStatus } from "./UserStatus.ts";
import { UserScopes } from "./UserScopes.ts";
import { StatusNames, ScopeNames } from "../constants.ts";

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public user_id: Number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public user_name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public picture!: string;

  @ForeignKey(() => UserStatus)
  @Column
  public user_status_id!: number;

  @ForeignKey(() => UserScopes)
  @Column
  public user_scope_id!: number;

  @BelongsTo(() => UserStatus)
  public UserStatus?: UserStatus;

  @BelongsTo(() => UserScopes)
  public UserScopes?: UserScopes;
}

export async function preloadUsers() {
  const status = await UserStatus.findOne({
    where: { status: StatusNames.DEFAULT },
  });
  const scope = await UserScopes.findOne({
    where: { scope: ScopeNames.ADMIN },
  });

  // TODO: Agregar otros mails de admins aca
  await User.create({
    name: "VagoDev1",
    user_name: "Desh",
    email: "deshens18@gmail.com",
    picture:
      "https://lh3.googleusercontent.com/a/ACg8ocJc4xXvwYl6TRzZNaf8Vg5SNtzN0FrnJkq3uPUsHvbX_rKZ0L8=s288-c-no",
    user_scope_id: scope.dataValues.user_scope_id,
    user_status_id: status.dataValues.user_status_id,
  });
}
