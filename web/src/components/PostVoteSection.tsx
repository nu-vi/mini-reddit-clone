import React from 'react';
import { PostSnippetFragment } from '../generated/graphql';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

interface PostVoteSectionProps {
  //post: PostsQuery["posts"]["posts"][0]
  post: PostSnippetFragment;
}

export const PostVoteSection: React.FC<PostVoteSectionProps> = ({ post }) => {
  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      marginRight={5}
    >
      <IconButton
        icon={<ChevronUpIcon boxSize={7} />}
        aria-label="upvote post"
      />
      <Text my={1} fontSize="lg">
        {post.points}
      </Text>
      <IconButton
        icon={<ChevronDownIcon boxSize={7} />}
        aria-label="downvote post"
      />
    </Flex>
  );
};
