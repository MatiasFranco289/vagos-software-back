import {
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Model,
} from "sequelize-typescript";

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
}
