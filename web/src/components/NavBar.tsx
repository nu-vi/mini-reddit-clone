import React from 'react';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
    //data is loading
  } else if (!data?.me) {
    //user not logged in
    body = (
      <>
        <Flex>
          <NextLink href="/login">
            <Button variant="link" color="black" fontSize="xl" mr={2}>
              login
            </Button>
          </NextLink>
          <NextLink href="/register">
            <Button variant="link" color="black" fontSize="xl">register</Button>
          </NextLink>
        </Flex>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex>
        <Box fontSize="xl" mr={2}>
          {data.me.username}
        </Box>
        <NextLink href="/create-post">
          <Button variant="link" color="black" mr={2} fontSize="xl">
            create post
          </Button>
        </NextLink>
        <Button
          onClick={() => {
            logout();
          }}
          variant="link"
          color="black"
          isLoading={logoutFetching}
          fontSize="xl"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={3} align="center">
      <NextLink href="/">
        <Link as={Heading} mr="auto">
          LiReddit
        </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
