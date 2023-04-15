import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Text,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Link,
  Tooltip,
  InputGroup,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import chainlinkPriceFeed from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
import { useContractRead } from "wagmi";
import { AggregatorV3Interface } from "@/types/typechain";

export default function CreateChallenge() {
  //* State and env variables
  const [creatorPrediction, setCreatorPrediction] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [ethUsdPrice, setEthUsdPrice] = useState<number>();
  const ethPriceFeedAddress =
    process.env.NEXT_PUBLIC_CHAINLINK_ETHUSD_CONTRACT_ADDRESS || "";

  //*Toast hook from Chakra
  const toast = useToast();

  //* Wagmi hooks and configuration to set up eth price feed
  const {
    data: ethFeedData,
    isError,
    isLoading,
    error: ethFeedError,
  } = useContractRead({
    // @ts-expect-error: Ignore as ethPriceFeedAddress is a proper address loaded from env
    address: ethPriceFeedAddress,
    abi: chainlinkPriceFeed,
    functionName: "latestRoundData",
    watch: true,
    onSuccess: (data: any) => {
      const ethPriceInUsd = data?.answer?.toNumber() / 10 ** 8;
      setEthUsdPrice(ethPriceInUsd);
    },
  });

  return (
    <Box bg="secondary.100" p={10} minHeight="90vh">
      <SimpleGrid
        height="100%"
        spacing={4}
        templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
      >
        <Card rounded="xl">
          <CardHeader>
            <Heading as="h2" size="md" textAlign="center">
              CONTRACT INFO
            </Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <FormControl isReadOnly>
              <FormLabel>ChallengeFactory Address</FormLabel>
              <Tooltip
                hasArrow
                label="Address on the ChallengeFactory contract used to create and
                deploy challenges with specified rules."
                bg="green.600"
                color="white"
              >
                <Input
                  variant="filled"
                  type="text"
                  bg="secondary.100"
                  value={"0x5FbDB2315678afecb367f032d93F642f64180aa3"}
                  size="sm"
                />
              </Tooltip>
              <FormHelperText>
                View on Etherscan:{" "}
                <Link
                  href="https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306"
                  target="_blank"
                  color="green.800"
                >
                  https://etherscan.io/address/0x5FbDB2315678afecb367f032d93F642f64180aa3
                </Link>
              </FormHelperText>
            </FormControl>

            <FormControl isReadOnly mt={4}>
              <FormLabel>Minimum Entry Fee</FormLabel>
              <Tooltip
                hasArrow
                label="Minimum entry fee that must be paid to create or challenge in
                ETH (Converted to Wei on-chain)."
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value="0.01"
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>

            <FormControl isReadOnly mt={4}>
              <FormLabel>Current Ethereum Price</FormLabel>
              <Tooltip
                hasArrow
                label="Latest price of ETH in USD from the Chainlink ETH/USD Price Feed."
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value={ethUsdPrice || "Loading..."}
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
          </CardBody>
        </Card>
        <Card rounded="2xl">
          <CardHeader>
            <Heading as="h1" size="md" textAlign="center">
              CREATE A CHALLENGE
            </Heading>
          </CardHeader>
          <Divider color="gray.300" />
          <CardBody>
            <Stack as="form" spacing={6} onSubmit={handleChallengeCreation}>
              <FormControl isRequired>
                <FormLabel>Your prediction</FormLabel>
                <Input
                  variant="outline"
                  type="number"
                  value={creatorPrediction}
                  onChange={(event) => setCreatorPrediction(event.target.value)}
                />
                <FormHelperText>
                  Enter your prediction of ETH/USD
                </FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Your wager</FormLabel>
                <Input
                  variant="outline"
                  type="number"
                  colorScheme="green"
                  value={entryFee}
                  onChange={(event) => setEntryFee(event.target.value)}
                />
                <FormHelperText>
                  Enter your wager in ETH. This price will be sent to the
                  challenge contract and locked when a challenger pays the same
                  entry fee. Minimum Entry Fee is 0.01 ETH.
                </FormHelperText>
              </FormControl>
              <Button type="submit" colorScheme="primary" alignSelf="center">
                Create Challenge
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
  function handleChallengeCreation(event: any) {
    event.preventDefault();
    console.log("creatorPrediction", creatorPrediction);
    console.log("entryFee", entryFee);
  }
}
