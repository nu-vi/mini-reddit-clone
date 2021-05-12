import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { HamburgerIcon, Icon } from '@chakra-ui/icons';
import { CgAdd, CgLogIn, CgLogOut, CgProfile, CgUserAdd } from 'react-icons/cg';
import { useApolloClient } from '@apollo/client';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery();
  let body = null;

  if (loading) {
    //data is loading
  } else if (!data?.me) {
    //user not logged in
    body = (
      <>
        <Flex display={{ base: 'none', sm: 'flex' }}>
          <NextLink href="/login">
            <Button variant="link" color="black" fontSize="xl" mr={2}>
              login
            </Button>
          </NextLink>
          <NextLink href="/register">
            <Button variant="link" color="black" fontSize="xl">
              register
            </Button>
          </NextLink>
        </Flex>

        <Flex display={{ base: 'flex', sm: 'none' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon boxSize={8} />}
              variant=""
            />
            <MenuList>
              <NextLink href="/login">
                <MenuItem
                  fontSize="lg"
                  icon={<Icon as={CgLogIn} boxSize={6} />}
                >
                  login
                </MenuItem>
              </NextLink>
              <NextLink href="/register">
                <MenuItem
                  fontSize="lg"
                  icon={<Icon as={CgUserAdd} boxSize={6} />}
                >
                  register
                </MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Flex>
      </>
    );
  } else {
    // user is logged in
    body = (
      <>
        <Flex display={{ base: 'none', sm: 'flex' }}>
          <Box fontSize="xl" mr={3}>
            {data.me.username}
          </Box>
          <NextLink href="/create-post">
            <Button variant="link" color="black" mr={3} fontSize="xl">
              create post
            </Button>
          </NextLink>
          <Button
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
            }}
            variant="link"
            color="black"
            isLoading={logoutFetching}
            fontSize="xl"
          >
            logout
          </Button>
        </Flex>

        <Flex display={{ base: 'flex', sm: 'none' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon boxSize={8} />}
              variant=""
            />
            <MenuList>
              <MenuItem
                fontSize="lg"
                icon={<Icon as={CgProfile} boxSize={6} />}
              >
                {data.me.username}
              </MenuItem>
              <NextLink href="/create-post">
                <MenuItem fontSize="lg" icon={<Icon as={CgAdd} boxSize={6} />}>
                  create post
                </MenuItem>
              </NextLink>
              <MenuItem
                onClick={async () => {
                  await logout();
                  await apolloClient.resetStore();
                }}
                fontSize="lg"
                icon={<Icon as={CgLogOut} boxSize={6} />}
              >
                logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={3} align="center">
      {/*<Flex align="center" m="auto" maxW={1000} flex={1}>*/}
      <NextLink href="/">
        <Link as={Heading} mr="auto">
          LiReddit
        </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
      {/*</Flex>*/}
    </Flex>
  );
};
