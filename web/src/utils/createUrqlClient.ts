import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(async ({ error }) => {
      if (error?.message.includes('Not authenticated')) {
        await Router.replace('/login');
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _args, cache) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _args, cache) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          /*        createPost: (_result, _args, cache) => {
            betterUpdateQuery<CreatePostMutation, PostsQuery>(
              cache,
              { query: PostsDocument },
              _result,
              (result, query) => {
                posts: query.posts,
              }
            )
          }*/
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
