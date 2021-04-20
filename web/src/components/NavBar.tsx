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
import { isServer } from '../utils/isServer';
import { HamburgerIcon, Icon } from '@chakra-ui/icons';
import { CgLogOut, CgProfile, CgAdd, CgLogIn, CgUserAdd } from 'react-icons/cg';

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
                <MenuItem fontSize="lg" icon={<Icon as={CgLogIn} boxSize={6} />}>
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
                onClick={() => {
                  logout();
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
      <NextLink href="/">
        <Link as={Heading} mr="auto">
          LiReddit
        </Link>
      </NextLink>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
