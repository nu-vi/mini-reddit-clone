import { DetailedHTMLProps, useEffect, useState } from 'react';
import { withUrqlClient } from 'next-urql';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import {
  Post,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
import { Layout } from '../components/Layout';
import { PostVoteSection } from '../components/PostVoteSection';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [postToDelete, setPostToDelete] = useState<Post, null>(null);
  const [{ data, fetching, stale }] = usePostsQuery({
    variables,
  });
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
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
        setVariables({
          limit: variables.limit,
          cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
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
              {renderAdminButtons(p)}
            </Flex>
            <Text fontSize="xl" mt={3}>
              {p.textSnippet + '...'}
            </Text>
          </Box>
        </Flex>
      )
    );

  const renderAdminButtons = (p: Post) => {
    if (p.originalPoster.id === meData?.me?.id) {
      return (
        <>
          <NextLink href="/post/edit/[id]" as={`post/edit/${p.id}`}>
            <IconButton
              ml="auto"
              icon={<EditIcon boxSize={5} />}
              aria-label="Delete Post"
              size="sm"
            />
          </NextLink>
          <IconButton
            ml={2}
            icon={<DeleteIcon boxSize={5} />}
            aria-label="Delete Post"
            size="sm"
            onClick={() => {
              setPostToDelete(p);
              onOpen();
            }}
          />
        </>
      );
    } else {
      return null;
    }
  };

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
                {stale ? (
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent top={20}>
            <ModalHeader>Delete Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete the{' '}
              <b>{!postToDelete ? null : postToDelete.title}</b> post?
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await deletePost({
                    id: postToDelete.id,
                  });
                  onClose();
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      {renderPosts()}
      {renderLoadingPosts()}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
