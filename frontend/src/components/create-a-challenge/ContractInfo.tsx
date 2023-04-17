import { RepeatIcon } from "@chakra-ui/icons";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";
import DatePicker from "react-datepicker";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  SimpleGrid,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import { BigNumber, utils } from "ethers";
import { ChallengeFactoryDetails, EthPriceFeedDetails } from "./types";
import { Stack } from "@chakra-ui/react";
import { formatDate } from "@/utilities/helpers";

export default function ContractInfo({
  ethPriceFeedDetails,
  challengeFactoryDetails,
}: ContractInfoProps) {
  return (
    <Card rounded="xl">
      <CardHeader>
        <Heading as="h2" size="md" textAlign="center">
          CONTRACT INFO
        </Heading>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Stack direction="column" spacing={4} divider={<StackDivider />}>
          <SimpleGrid spacing={4} columns={2}>
            <Heading as="h3" size="sm" gridColumn="span 2">
              Ethereum Price Feed
              <Tooltip
                hasArrow
                label="Refresh the ETH/USD price feed using Chainlink's contract"
                bg="gray.900"
                color="white"
              >
                <IconButton
                  ms={2}
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                  onClick={ethPriceFeedDetails?.refetchEthFeed}
                  aria-label="Refresh ETH/USD Price Data"
                  icon={<RepeatIcon />}
                />
              </Tooltip>
            </Heading>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", md: "span 2", lg: "span 1" }}
            >
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
                    value={
                      ethPriceFeedDetails?.ethUsdPrice
                        ? utils.formatUnits(ethPriceFeedDetails.ethUsdPrice, 8)
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">USD</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
            <FormControl isReadOnly gridColumn={{ md: "span 2", lg: "span 1" }}>
              <FormLabel>Last Updated At</FormLabel>
              <Tooltip
                hasArrow
                label="Date and Time of the last update to the ETH/USD price feed by chainlink."
                bg="green.600"
                color="white"
              >
                <Input
                  variant="filled"
                  type="text"
                  bg="secondary.100"
                  size="sm"
                  value={
                    ethPriceFeedDetails?.lastUpdatedAt
                      ? formatDate(
                          new Date(
                            ethPriceFeedDetails.lastUpdatedAt.toNumber() * 1000
                          )
                        )
                      : "Loading..."
                  }
                />
              </Tooltip>
            </FormControl>
          </SimpleGrid>
          <SimpleGrid spacing={4} columns={2}>
            <Heading as="h3" size="sm" gridColumn="span 2">
              Challenge Factory
              <Tooltip
                hasArrow
                label="Reload the parameters of the challenge factory contract. These parameters do not change often."
                bg="gray.900"
                color="white"
              >
                <IconButton
                  ms={2}
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                  onClick={ethPriceFeedDetails?.refetchEthFeed}
                  aria-label="Refresh ETH/USD Price Data"
                  icon={<RepeatIcon />}
                />
              </Tooltip>
            </Heading>
            <FormControl isReadOnly gridColumn={{ base: "span 2" }}>
              <FormLabel size="sm">ChallengeFactory Address</FormLabel>
              <Tooltip
                hasArrow
                label={`Address on the ChallengeFactory contract used to create and
                deploy challenges with specified rules. The contract in owned by ${
                  challengeFactoryDetails?.owner || "?"
                } and was started at block ${
                  challengeFactoryDetails?.startBlock || "?"
                }.`}
                bg="green.600"
                color="white"
              >
                <Input
                  variant="filled"
                  type="text"
                  bg="secondary.100"
                  value={
                    challengeFactoryDetails?.challengeFactoryAddress ||
                    "Loading..."
                  }
                  size="sm"
                />
              </Tooltip>
              <FormHelperText>
                View on Etherscan:{" "}
                <Link
                  href={`https://sepolia.etherscan.io/address/${
                    challengeFactoryDetails?.challengeFactoryAddress || "?"
                  }`}
                  target="_blank"
                  color="green.800"
                >
                  {`https://sepolia.etherscan.io/address/${challengeFactoryDetails?.challengeFactoryAddress}`}
                </Link>
              </FormHelperText>
            </FormControl>

            <FormControl isReadOnly gridColumn={{ md: "span 2", lg: "span 1" }}>
              <FormLabel>Challenge Duration</FormLabel>
              <Tooltip
                hasArrow
                label={`The challenge must be open for others to accept for a number of seconds in this range before it is locked.Challenge must be open for at least ${
                  challengeFactoryDetails?.minChallengeDuration ?? "?"
                } seconds and at most ${
                  challengeFactoryDetails?.maxChallengeDuration ?? "?"
                } seconds.`}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value={
                      challengeFactoryDetails?.minChallengeDuration &&
                      challengeFactoryDetails?.maxChallengeDuration
                        ? `${challengeFactoryDetails.minChallengeDuration} to ${challengeFactoryDetails.maxChallengeDuration}`
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">SEC</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
            <FormControl isReadOnly gridColumn={{ md: "span 2", lg: "span 1" }}>
              <FormLabel>Lock Duration</FormLabel>
              <Tooltip
                hasArrow
                label={`The challenge must be locked for a number of seconds in this range before it enters settlement period. Challenge must be locked for at least ${
                  challengeFactoryDetails?.minLockDuration ?? "?"
                } seconds and at most ${
                  challengeFactoryDetails?.maxLockDuration ?? "?"
                } seconds.`}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value={
                      challengeFactoryDetails?.minLockDuration &&
                      challengeFactoryDetails?.maxLockDuration
                        ? `${challengeFactoryDetails.minLockDuration} to ${challengeFactoryDetails.maxLockDuration}`
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">SEC</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>

            <FormControl isReadOnly gridColumn={{ md: "span 2", lg: "span 1" }}>
              <FormLabel>Settlement Duration</FormLabel>
              <Tooltip
                hasArrow
                label={`Once the challenge enters the settlement period, it will be open for anyone to settle (including the participants) for ${
                  challengeFactoryDetails?.settlementDuration ?? "?"
                } seconds. `}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value={
                      challengeFactoryDetails?.settlementDuration?.toString() ??
                      "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">SEC</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>

            <FormControl isReadOnly gridColumn={{ md: "span 2", lg: "span 1" }}>
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
                    value={
                      challengeFactoryDetails?.minEntryFee
                        ? utils.formatEther(challengeFactoryDetails.minEntryFee)
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
          </SimpleGrid>
        </Stack>
      </CardBody>
    </Card>
  );
}

type ContractInfoProps = {
  ethPriceFeedDetails: EthPriceFeedDetails | undefined;
  challengeFactoryDetails: ChallengeFactoryDetails | undefined;
};
