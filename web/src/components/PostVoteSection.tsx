import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';
import { Flex, IconButton, Spinner, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface PostVoteSectionProps {
  //post: PostsQuery["posts"]["posts"][0]
  post: PostSnippetFragment;
}

export const PostVoteSection: React.FC<PostVoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [currentPoints, setCurrentPoints] = useState<number>(post.points);
  const [, vote] = useVoteMutation();

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
            postId: post.id,
            value: 1,
          }).then(({ data }) => {
            if (data) {
              console.log(data);
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
            postId: post.id,
            value: -1,
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
