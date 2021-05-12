import { DetailedHTMLProps, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Post, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { PostVoteSection } from '../components/PostVoteSection';
import { DeleteModal } from '../components/DeleteModal';
import { AdminButtons } from '../components/AdminButtons';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        fetchMore({
          variables: {
            limit: variables?.limit,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
          },
        });
      }
    }
  };

  const mapPosts = (data: any) =>
    data.posts.posts.map((p: Post | null) =>
      !p ? null : (
        <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
          <PostVoteSection post={p} />
          <Box flex={1}>
            <Flex>
              <Box>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text fontSize="m" mt={1}>
                  Posted by {p.originalPoster.username}
                </Text>
              </Box>
              <Box ml="auto">
                <AdminButtons
                  postId={p.id}
                  opId={p.originalPoster.id}
                  onDeleteClick={() => {
                    setPostToDelete(p);
                    onOpen();
                  }}
                />
              </Box>
            </Flex>
            <Text fontSize="xl" mt={3}>
              {p.textSnippet + '...'}
            </Text>
          </Box>
        </Flex>
      )
    );

  const renderPosts = () => {
    if (loading && !data) {
      return <div>loading...</div>;
    }
    if (!loading && !data) {
      return (
        <>
          <Heading>Your posts query failed for some reason.</Heading>
          <br />
          <Heading>Please try again later.</Heading>
          <Text mt={8}>{error?.message}</Text>
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

  const renderLoadingPosts = () => {
    if (data && data.posts.hasMore) {
      return (
        <>
          <Stack backgroundColor="gray.50" spacing={8} mt={8}>
            <Flex
              key="loading"
              p={5}
              shadow="md"
              borderWidth="1px"
              justifyContent="center"
            >
              <Box>
                {loading ? (
                  <Spinner
                    thickness="6px"
                    emptyColor="gray.200"
                    color="#b7b7b7"
                    size="xl"
                    p={7}
                    m={1}
                  />
                ) : (
                  <Box p={12}></Box>
                )}
              </Box>
            </Flex>
          </Stack>
          <Box mt={8}></Box>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Layout>
      <DeleteModal
        postToDelete={postToDelete!}
        isOpen={isOpen}
        onClose={onClose}
      />
      {renderPosts()}
      {renderLoadingPosts()}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
