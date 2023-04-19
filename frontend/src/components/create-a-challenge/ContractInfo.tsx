import { RepeatIcon } from "@chakra-ui/icons";
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
import { utils } from "ethers";
import { ChallengeFactoryDetails } from "./types";
import { Stack } from "@chakra-ui/react";
import ChallengeDetailsGrid from "../challenge/ChallengeDetailsGrid";
import { ChallengeDetails } from "../challenge/types";
import { EthPriceFeedDetails } from "../pricefeed/types";
import PriceFeedGrid from "../pricefeed/PriceFeedGrid";

export default function ContractInfo({
  ethPriceFeedDetails,
  challengeFactoryDetails,
  challengeDetails,
  setChallengeDetails,
}: ContractInfoProps) {
  return (
    <Card rounded="xl">
      <CardHeader>
        <Heading as="h2" size="lg" textAlign="center" fontWeight={400}>
          CONTRACT INFO
        </Heading>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Stack direction="column" spacing={4} divider={<StackDivider />}>
          <PriceFeedGrid ethPriceFeedDetails={ethPriceFeedDetails} />

          <SimpleGrid spacing={4} columns={2}>
            <Heading as="h3" size="md" gridColumn="span 2" fontWeight={100}>
              Challenge Factory
              <Tooltip
                hasArrow
                label="Reload the parameters of the challenge factory contract. These parameters do not change often."
                bg="gray.900"
                color="white"
              >
                <IconButton
                  ms={2}
                  colorScheme="yellow"
                  variant="solid"
                  size="sm"
                  onClick={challengeFactoryDetails?.refetchChallengeFactory}
                  aria-label="Refresh ChallengeFactory data"
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
                    challengeFactoryDetails?.challengeFactoryAddress ?? "?"
                  }`}
                  target="_blank"
                  color="green.800"
                >
                  {`https://sepolia.etherscan.io/address/${
                    challengeFactoryDetails?.challengeFactoryAddress ?? "?"
                  }`}
                </Link>
              </FormHelperText>
            </FormControl>

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
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
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
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

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
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

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
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

          <ChallengeDetailsGrid
            challengeDetails={challengeDetails}
            setChallengeDetails={setChallengeDetails}
          />
        </Stack>
      </CardBody>
    </Card>
  );
}

type ContractInfoProps = {
  ethPriceFeedDetails: EthPriceFeedDetails;
  challengeFactoryDetails: ChallengeFactoryDetails;
  challengeDetails: ChallengeDetails;
  setChallengeDetails: (challengeDetails: ChallengeDetails) => void;
};
