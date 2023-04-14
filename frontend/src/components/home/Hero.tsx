import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function Hero() {
  return (
    <Stack
      as={"section"}
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bg="secondary.100"
      color="gray.900"
    >
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Text
              as={"span"}
              position={"relative"}
              zIndex={1}
              _after={{
                content: "''",
                width: "full",
                height: useBreakpointValue({ base: "20%", md: "30%" }),
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "primary.400",
                zIndex: -1,
              }}
            >
              Create Wagers.
            </Text>
            <br />
            <Text color={"primary.400"} as={"span"}>
              Challenge. Win!
            </Text>
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.600"}>
            WagerWinz is a decentralized platform for creating, challenging, and
            winning wagers by predicting the price of ETH/USD. Create a wager,
            challenge a friend, and win ETH. Available only on Sepolia Testnet.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              rounded={"full"}
              bg={"gray.800"}
              color={"white"}
              _hover={{
                bg: "green.600",
              }}
            >
              Get Started
            </Button>
            <Button
              rounded={"full"}
              variant="outline"
              colorScheme="gray.900"
              _hover={{ color: "green.600" }}
            >
              How it works
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Hero Image"} objectFit={"cover"} src={"/hero-image.jpg"} />
      </Flex>
    </Stack>
  );
}
