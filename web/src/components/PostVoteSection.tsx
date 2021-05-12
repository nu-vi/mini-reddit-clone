import React, {useState} from 'react';
import {PostSnippetFragment, useVoteMutation, VoteMutation,} from '../generated/graphql';
import {Flex, IconButton, Spinner, Text} from '@chakra-ui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@chakra-ui/icons';
import gql from 'graphql-tag';
import {ApolloCache} from '@apollo/client';

interface PostVoteSectionProps {
  //post: PostsQuery["posts"]["posts"][0]
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) => {
  const data = cache.readFragment<{
    id: number;
    voteStatus: number | null;
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        id
        voteStatus
      }
    `,
  });

  if (data) {
    if (data.voteStatus === value) {
      cache.writeFragment({
        id: 'Post:' + postId,
        fragment: gql`
          fragment __ on Post {
            voteStatus
          }
        `,
        data: { id: postId, voteStatus: null },
      });
      return;
    }

    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          voteStatus
        }
      `,
      data: { id: postId, voteStatus: value },
    });
  }
};

export const PostVoteSection: React.FC<PostVoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [currentPoints, setCurrentPoints] = useState<number>(post.points);
  const [vote] = useVoteMutation();

  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      marginRight={5}
    >
      <IconButton
        onClick={() => {
          setLoadingState('upvote-loading');
          vote({
            variables: {
              postId: post.id,
              value: 1,
            },
            update: (cache) => updateAfterVote(1, post.id, cache),
          }).then(({ data }) => {
            if (data) {
              setCurrentPoints(data.vote.points);
            }
            setLoadingState('not-loading');
          });
        }}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        icon={<ChevronUpIcon boxSize={7} />}
        aria-label="upvote post"
      />
      <Text my={1} fontSize="lg">
        {loadingState === 'not-loading' ? currentPoints : <Spinner size="sm" />}
      </Text>
      <IconButton
        onClick={() => {
          setLoadingState('downvote-loading');
          vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          }).then(({ data }) => {
            if (data) {
              setCurrentPoints(data.vote.points);
            }
            setLoadingState('not-loading');
          });
        }}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        backgroundColor={post.voteStatus === -1 ? 'tomato' : undefined}
        color={post.voteStatus === -1 ? 'white' : undefined}
        icon={<ChevronDownIcon boxSize={7} />}
        aria-label="downvote post"
      />
    </Flex>
  );
};
