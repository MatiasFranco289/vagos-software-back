import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
  BelongsToMany,
} from "sequelize-typescript";
import { Projects } from "./Projects.ts";
import { ProjectsTags } from "./ProjectsTags.ts";

@Table({
  tableName: "tags",
  timestamps: true,
})
export class Tags extends Model<Tags> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public tag_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public tag_name: string;

  @BelongsToMany(() => Projects, {
    through: () => ProjectsTags,
  })
  public Projects?: Projects[];
}
