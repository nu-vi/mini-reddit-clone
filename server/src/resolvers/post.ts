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
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';

@ObjectType()
class PostFieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [PostFieldError], { nullable: true })
  errors?: PostFieldError[];
  @Field(() => Post, { nullable: true })
  post?: Post;
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
  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    if (input.title.length <= 2) {
      return {
        errors: [
          {
            field: 'title',
            message: 'Title length must be greater than  2',
          },
        ],
      };
    }

    if (input.text.length <= 2) {
      return {
        errors: [
          {
            field: 'text',
            message: 'Body length must be greater than  2',
          },
        ],
      };
    }

    const post = Post.create({
      ...input,
      originalPosterId: req.session.userId,
    });

    await post.save();

    return { post };
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    // USING THE ACTUAL QUERY
    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.* 
    from post p
    ${cursor ? `where p."createdAt" < $2` : ''}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // USING QUERY BUILDER
    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder('p')
    //   .select('value')
    //   .from(Upvote, 'voteStatus')
    //   .where('"userId" = :id', {
    //     id: req.session.userId,
    //   })
    //   .andWhere('"postId" = p.id')
    //   .innerJoinAndSelect('p.originalPoster', 'op')
    //   .orderBy({ 'p.createdAt': 'DESC' })
    //   .take(realLimitPlusOne);
    //
    // if (cursor) {
    //   qb.where('p.createdAt < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }
    //
    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('text', () => String, { nullable: true }) text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (post.originalPosterId !== req.session.userId) {
      throw new Error('not authorized');
    }
    if (typeof title === 'undefined' && typeof text === 'undefined') {
      return post;
    }
    if (typeof title !== 'undefined') {
      post.title = title;
    }
    if (typeof text !== 'undefined') {
      post.text = text;
    }
    await Post.save(post);
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const post = await Post.findOne(id);
    if (!post) {
      return false;
    }
    if (post.originalPosterId !== req.session.userId) {
      throw new Error('not authorized');
    }
    await Upvote.delete({ postId: id });
    await Post.delete({ id });
    return true;
  }

  @Mutation(() => Post || null)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const isUpvote = value !== -1;
    const realValue = isUpvote ? 1 : -1;
    const { userId } = req.session;

    const post = await Post.findOne(postId);
    if (!post) {
      return null;
    }

    const upvote = await Upvote.findOne({ where: { postId, userId } });
    if (upvote && upvote.value !== realValue) {
      // user has voted on this post before
      // and is changing it
      await Upvote.update(upvote, {
        userId,
        postId,
        value: realValue,
      });

      post.points = post.points + 2 * realValue;
      await Post.save(post);
    } else if (upvote && upvote.value === realValue) {
      // user has voted on this post before
      // and is cancelling it
      await Upvote.delete(upvote);
      post.points = post.points - realValue;
      await Post.save(post);
    } else if (!upvote) {
      // user has never voted before
      await Upvote.insert({
        userId,
        postId,
        value: realValue,
      });

      post.points = post.points + realValue;

      await Post.save(post);
    }

    return post;
  }

  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 165);
  }

  @FieldResolver(() => User)
  originalPoster(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.originalPosterId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { upvoteLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      // not logged in, so no vote status
      return null;
    }

    const upvote = await upvoteLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });

    return upvote ? upvote.value : null;
  }
}
