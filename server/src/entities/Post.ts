import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Upvote } from './Upvote';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Field()
  @Column()
  originalPosterId: number;

  @Field(() => Int, {nullable: true})
  voteStatus: number | null; // 1 or =1 or null

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  originalPoster: User;

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];
}
