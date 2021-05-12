import React, { useState } from 'react';
import { Box, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { Layout } from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { AdminButtons } from '../../components/AdminButtons';
import { DeleteModal } from '../../components/DeleteModal';
import { withApollo } from '../../utils/withApollo';

export const Post = ({}) => {
  const { data, loading } = useGetPostFromUrl();
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderBody = () => {
    if (!data) {
      if (loading) {
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
            <DeleteModal
              postToDelete={postToDelete!}
              isOpen={isOpen}
              onClose={onClose}
              routeTo="/"
            />
            <Flex mt={4} alignItems="center">
              <Heading>{data.post.title}</Heading>
              <Box ml="auto" mr={10}>
                <AdminButtons
                  postId={data.post.id}
                  opId={data.post.originalPoster.id}
                  onDeleteClick={() => {
                    setPostToDelete(data?.post);
                    onOpen();
                  }}
                />
              </Box>
            </Flex>
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

export default withApollo({ ssr: true })(Post);
