import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Tags } from "./Tags.js";
import { ProjectStatus } from "./ProjectStatus.js";
import { User } from "./Users.js";

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

  @ForeignKey(() => Tags)
  @Column
  public tag_id: number;

  @BelongsTo(() => Tags)
  public Tags?: Tags;

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
}

// creado por -- >

// Imagenes
// Videos

//-------------------------BLOGS-------------------------------------
// Los blogs van a estar escritors en markdown asi que el modelo de un post seria algo como

// id
// texto: Markdown
