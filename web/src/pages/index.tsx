import { DetailedHTMLProps, useEffect, useState } from 'react';
import { withUrqlClient } from 'next-urql';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Post, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll: DetailedHTMLProps<any, any> = () => {
    const e = document.documentElement;
    const userScrolled80Percent =
      e.scrollHeight - e.scrollTop <= e.clientHeight * 1.2;

    if (userScrolled80Percent) {
      if (data && data.posts.hasMore) {
        setVariables({
          limit: variables.limit,
          cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
        });
      }
    }
  };

  const mapPosts = (data: any) =>
    data.posts.posts.map((p: Post) => (
      <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
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
          <Text my={1} fontSize="lg">{p.points}</Text>
          <IconButton
            icon={<ChevronDownIcon boxSize={7} />}
            aria-label="downvote post"
          />
        </Flex>
        <Box>
          <Heading fontSize="xl">{p.title}</Heading>
          <Text fontSize="m" mt={1}>
            Posted by {p.originalPoster.username}
          </Text>
          <Text fontSize="xl" mt={3}>
            {p.textSnippet + '...'}
          </Text>
        </Box>
      </Flex>
    ));

  const renderPosts = () => {
    if (fetching && !data) {
      return <div>loading...</div>;
    }
    if (!fetching && !data) {
      return (
        <>
          <Heading>Your posts query failed for some reason.</Heading>
          <br />
          <Heading>Please try again later.</Heading>
        </>
      );
    } else {
      return (
        <>
          <Flex align="center">
            <Heading mb={2}>Recent Posts</Heading>
          </Flex>
          <br />
          <Stack spacing={8}>{mapPosts(data)}</Stack>
        </>
      );
    }
  };

  const renderButton = () => {
    if (data && data.posts.hasMore) {
      return (
        <Flex>
          <Button
            onClick={() =>
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={stale}
            m="auto"
            my={8}
          >
            load more posts
          </Button>
        </Flex>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      {renderPosts()}
      {renderButton()}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
