import { withUrqlClient } from 'next-urql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Post, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });

  const mapPosts = (data: any) =>
    data.posts.posts.map((p: Post) => (
      <Box key={p.id} p={5} shadow="md" borderWidth="1px">
        <Heading fontSize="xl">{p.title}</Heading>
        <Text mt={4}>{p.textSnippet + '...'}</Text>
      </Box>
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
