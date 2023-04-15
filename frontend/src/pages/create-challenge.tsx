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
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateChallenge() {
  const [creatorPrediction, setCreatorPrediction] = useState("");
  const [entryFee, setEntryFee] = useState("");

  const handleChallengeCreation = async (event: any) => {
    event.preventDefault();
    console.log("creatorPrediction", creatorPrediction);
    console.log("entryFee", entryFee);
  };
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
}
