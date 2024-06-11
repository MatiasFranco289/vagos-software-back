import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "project_status",
  timestamps: true,
})
export class ProjectStatus extends Model<ProjectStatus> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public project_status_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public status_name: string;
}
