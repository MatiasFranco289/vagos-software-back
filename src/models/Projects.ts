import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { Tags } from "./Tags.ts";
import { ProjectStatus } from "./ProjectStatus.ts";
import { User } from "./Users.ts";
import { ProjectsTags } from "./ProjectsTags.ts";
import {
  DataTypes,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
} from "sequelize";

@Table({
  tableName: "projects",
  timestamps: true,
})
export class Projects extends Model<Projects> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public project_id: Number;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @Column({ type: DataType.STRING })
  public thumbnail: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public startDate: Date;

  @Column({ type: DataType.DATE })
  public endDate: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  public description: string;

  @ForeignKey(() => ProjectStatus)
  @Column
  public project_status_id: number;

  @BelongsTo(() => ProjectStatus)
  public ProjectStatus?: ProjectStatus;

  @ForeignKey(() => User)
  @Column
  public created_by: number;

  @BelongsTo(() => User)
  public User: User;

  @BelongsToMany(() => Tags, {
    through: () => ProjectsTags,
  })
  public Tags?: Tags[];
  addTags: BelongsToManyAddAssociationsMixin<Tags, number>;
}
