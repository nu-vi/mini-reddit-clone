import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class Upvote extends BaseEntity {

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @Column({ type: 'int' })
  value: number;

  @ManyToOne(() => User, (user) => user.upvotes)
  user: User;

  @ManyToOne(() => Post, (post) => post.upvotes)
  post: Post;
}
