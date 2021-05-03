import React from 'react';
import NextLink from 'next/link';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Post } from '../generated/graphql';

export const AdminButtons = (
  p: Post,
  meData: any,
  onDeleteClick: () => void
) => {
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
          onClick={onDeleteClick}
        />
      </>
    );
  } else {
    return null;
  }
};
