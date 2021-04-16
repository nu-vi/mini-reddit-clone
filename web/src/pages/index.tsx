import { withUrqlClient } from 'next-urql';
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Post, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  const mapPosts = (data: any) =>
    data.posts.map((p: Post) => (
      <Box key={p.id} p={5} shadow="md" borderWidth="1px">
        <Heading fontSize="xl">{p.title}</Heading>
        <Text mt={4}>{p.textSnippet + '...'}</Text>
      </Box>
    ));

  const renderPosts = () => {
    if (fetching && !data) {
      return <div>loading...</div>;
    } if (!fetching && !data) {
      return (
        <Flex>
          <Heading>Your posts query failed for some reason. Please try again later</Heading>
        </Flex>
      )
    } else {
      return <Stack spacing={8}>{mapPosts(data)}</Stack>;
    }
  };

  const renderButton = () => {
    if (data) {
      return (
        <Flex>
          <Button isLoading={fetching} m="auto" my={8}>
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
      <Flex align="center">
        <Heading mb={2}>Recent Posts</Heading>
      </Flex>
      <br />
      {renderPosts()}
      {renderButton()}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
