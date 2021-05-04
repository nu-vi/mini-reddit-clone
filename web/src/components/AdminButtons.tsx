import React from 'react';
import NextLink from 'next/link';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useMeQuery } from '../generated/graphql';

interface AdminButtonProps {
  postId: number;
  opId: number;
  onDeleteClick: () => void;
}

export const AdminButtons: React.FC<AdminButtonProps> = ({
  postId,
  opId,
  onDeleteClick,
}) => {
  const [{ data: meData }] = useMeQuery();

  if (opId === meData?.me?.id) {
    return (
      <>
        <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
          <IconButton
            icon={<EditIcon boxSize={5} />}
            aria-label="Edit Post"
            size="sm"
          />
        </NextLink>
        <IconButton
          ml={2}
          icon={<DeleteIcon boxSize={5} />}
          aria-label="Delete Post"
          size="sm"
          onClick={onDeleteClick}
        />
      </>
    );
  } else {
    return null;
  }
};
