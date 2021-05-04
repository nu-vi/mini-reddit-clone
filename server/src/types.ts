import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/dataLoaders/createUserLoader';
import { createUpvoteLoader } from './utils/dataLoaders/createUpvoteLoader';

export type MyContext = {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  upvoteLoader: ReturnType<typeof createUpvoteLoader>;
};

declare module 'express-session' {
  interface Session {
    userId: number;
  }
}
