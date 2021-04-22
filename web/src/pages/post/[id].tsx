import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Heading, Text } from '@chakra-ui/react';

export const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

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
