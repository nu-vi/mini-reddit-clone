import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Post, useDeletePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

interface DeleteModalProps {
  postToDelete: Post;
  isOpen: boolean;
  onClose: () => void;
  routeTo?: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  postToDelete,
  isOpen,
  onClose,
  routeTo,
}) => {
  const [deletePost] = useDeletePostMutation();
  const router = useRouter();

  return (
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
                variables: {
                  id: postToDelete.id,
                },
                update: (cache) => {
                  cache.evict({ id: 'Post:' + postToDelete.id });
                },
              });
              onClose();
              if (routeTo) {
                await router.push(routeTo);
              }
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
