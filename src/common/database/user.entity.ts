import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @IsString()
  nickname: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  name: string;
}
