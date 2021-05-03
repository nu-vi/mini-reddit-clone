import React from 'react';
import { withUrqlClient } from 'next-urql';
import { Heading, Text } from '@chakra-ui/react';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { Layout } from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

export const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

  const renderBody = () => {
    if (!data) {
      if (fetching) {
        return <div>loading...</div>;
      } else {
        return (
          <>
            <Heading>Your post query failed for some reason.</Heading>
            <br />
            <Heading>Please try again later.</Heading>
          </>
        );
      }
    } else {
      if (!data.post) {
        return (
          <>
            <Heading>Could not find the post you requested</Heading>
          </>
        );
      } else {
        return (
          <>
            <Heading mt={4}>{data.post.title}</Heading>
            <Text fontSize="xl" mt={4}>
              {data.post.text}
            </Text>
          </>
        );
      }
    }
  };

  return <Layout>{renderBody()}</Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
