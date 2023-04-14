import { ReactNode } from "react";

import {
  Box,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { ABOUT_ITEMS, NAV_ITEMS } from "./types";

export default function Footer() {
  return (
    <Box
      as="footer"
      color="gray.900"
      mt="auto"
      bg="whiteAlpha.800"
      backdropFilter="saturate(180%) blur(10px)"
      borderTop={1}
      borderStyle={"none"}
    >
      <Flex as={Stack} pt={10} px={10} pb={5}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Flex justify={"center"}>
              <Link as={NextLink} href="/">
                <Image src="/logo.png" alt="WagerWinz" w={"128px"} h="auto" />
              </Link>
            </Flex>
            <Text fontSize={"sm"} align={"center"}>
              © 2023 WagerWinz. All rights reserved.
            </Text>
          </Stack>

          <Stack>
            <ListHeader>App</ListHeader>
            {NAV_ITEMS.map((navItem) => (
              <Link as={NextLink} key={navItem.label} href={navItem.link}>
                {navItem.label}
              </Link>
            ))}
          </Stack>
          <Stack>
            <ListHeader>About</ListHeader>
            {ABOUT_ITEMS.map((navItem) => (
              <Link as={NextLink} key={navItem.label} href={navItem.link}>
                {navItem.label}
              </Link>
            ))}
          </Stack>
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};
