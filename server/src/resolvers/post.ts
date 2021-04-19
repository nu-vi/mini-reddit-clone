import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { isAuth } from '../middleware/isAuth';
import { getConnection } from 'typeorm';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    // USING THE ACTUAL QUERY
    // const replacements: any[] = [realLimitPlusOne];
    //
    // if (cursor) {
    //   replacements.push(new Date(parseInt(cursor)));
    // }
    //
    // const posts = await getConnection().query(
    //   `
    // select p.*,
    // json_build_object(
    // 'id', u.id,
    // 'username', u.username,
    // 'email', u.email
    // 'createdAt', u."createdAt"
    //  'updatedAt, u."updatedAt"
    // ) "originalPoster"
    // from post p
    // inner join public.user u on u.id = p."originalPosterId"
    // ${cursor ? `where p."createdAt" < $2` : ''}
    // order by p."createdAt" DESC
    // limit $1
    // `,
    //   replacements
    // );

    // USING QUERY BUILDER
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.originalPoster', 'op')
      .orderBy({ 'p.createdAt': 'DESC' })
      .take(realLimitPlusOne);

    if (cursor) {
      qb.where('p.createdAt < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }

    const posts = await qb.getMany();

    console.log(posts);
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      originalPosterId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }

    if (typeof title !== 'undefined') {
      post.title = title;
      await Post.save(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    try {
      await Post.delete(id);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 200);
  }
}
