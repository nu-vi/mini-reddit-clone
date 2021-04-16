import { withUrqlClient } from 'next-urql';
import {Box, Heading, Link, Stack, Text} from '@chakra-ui/react';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import {Post, usePostsQuery} from '../generated/graphql';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  const mapPosts = (data: any) => data.posts.map((p: Post) => (
    <Box key={p.id} p={5} shadow="md" borderWidth="1px">
      <Heading fontSize="xl">{p.title}</Heading>
      <Text mt={4}>{p.text.slice(0, 200) + '...'}</Text>
    </Box>
  ))

  const renderBody = () => {
    if (!data) {
      return null;
    } else {
      return (
        <Stack spacing={8}>
          {mapPosts(data)}
        </Stack>
      );
    }
  };

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      <br />
      <br />
      {renderBody()}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
