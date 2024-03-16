import { AllowNull, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class Session extends Model<Session> {
  @Column({ primaryKey: true, type: DataType.UUID })
  userId: string;

  @Column({ primaryKey: true })
  clientId: string;

  @AllowNull(false)
  @Column
  refreshToken: string;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt: Date;
}
