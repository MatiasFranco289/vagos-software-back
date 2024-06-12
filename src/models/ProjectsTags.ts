import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Projects } from "./Projects.js";
import { Tags } from "./Tags.js";

@Table({
  tableName: "projects_tags",
  timestamps: true,
})
export class ProjectsTags extends Model<ProjectsTags> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id: number;

  @ForeignKey(() => Projects)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @ForeignKey(() => Tags)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public tag_id: number;
}
