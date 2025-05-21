import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({
    length: 255,
    nullable: false
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value?.toLowerCase(),
      from: (value: string) => value
    }
  })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  imageFileId: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, +process.env.SALT!);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
