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
import {
  ChallengeDetails,
  ChallengeFactoryDetails,
  EthPriceFeedDetails,
} from "./types";
import { Stack } from "@chakra-ui/react";
import { calculateSettlementIncentive, formatDate } from "@/utilities/helpers";

export default function ContractInfo({
  ethPriceFeedDetails,
  challengeFactoryDetails,
  challengeDetails,
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
          <SimpleGrid spacing={4} columns={2}>
            <Heading as="h3" size="md" gridColumn="span 2" fontWeight={100}>
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
              gridColumn={{ base: "span 2", lg: "span 1" }}
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
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
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
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                  onClick={challengeFactoryDetails?.refetchChallengeFactory}
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
          <SimpleGrid spacing={4} columns={2}>
            <Heading as="h3" size="md" gridColumn="span 2" fontWeight={100}>
              Challenge Details
              <Tooltip
                hasArrow
                label="Reload the state of the challenge factory contract.."
                bg="gray.900"
                color="white"
              >
                <IconButton
                  ms={2}
                  colorScheme="green"
                  variant="solid"
                  size="sm"
                  onClick={challengeDetails?.refetchChallengeDetails}
                  aria-label="Refresh ETH/USD Price Data"
                  icon={<RepeatIcon />}
                />
              </Tooltip>
            </Heading>
            <FormControl isReadOnly gridColumn={{ base: "span 2" }}>
              <FormLabel size="sm">Challenge Address</FormLabel>
              <Tooltip
                hasArrow
                label={`Address on the Challenge contract created using the challenge create component. Please save this address as it will be used to interact with the challenge. The contract was initialized at block ${
                  challengeDetails?.startBlock || "?"
                }.`}
                bg="green.600"
                color="white"
              >
                <Input
                  variant="filled"
                  type="text"
                  bg="secondary.100"
                  value={challengeDetails?.challengeAddress ?? "Loading..."}
                  size="sm"
                />
              </Tooltip>
              <FormHelperText>
                View on Etherscan:{" "}
                <Link
                  href={`https://sepolia.etherscan.io/address/${
                    challengeDetails?.challengeAddress ?? "?"
                  }`}
                  target="_blank"
                  color="green.800"
                >
                  {`https://sepolia.etherscan.io/address/${
                    challengeDetails?.challengeAddress ?? "?"
                  }`}
                </Link>
              </FormHelperText>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Transaction Hash</FormLabel>
              <Tooltip
                hasArrow
                label={`Hash of the Transaction which created the contract.
                This can be used to verify the contract on Etherscan.`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.txHash ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Entry Fee</FormLabel>
              <Tooltip
                hasArrow
                label={`Entry fee required to accept the challenge. The exact wei value in the contract is ${
                  challengeDetails?.entryFee ?? "?"
                } `}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    value={
                      challengeDetails?.entryFee
                        ? utils.formatEther(challengeDetails.entryFee)
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>{`Challenge start time`}</FormLabel>
              <Tooltip
                hasArrow
                label={`Timestamp of the block the challenge was initialized at. As block.timestamp is not 100% accurate, this value may not sync exactly with realtime timestamp. Exact numeric value in seconds in the contract is ${
                  challengeDetails?.startTime?.toString() ?? "?"
                }`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={
                    challengeDetails?.startTime
                      ? formatDate(
                          new Date(challengeDetails.startTime.toNumber() * 1000)
                        )
                      : "Loading..."
                  }
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>{`Challenge lock time`}</FormLabel>
              <Tooltip
                hasArrow
                label={`Timestamp at which the challenge will be locked. If the challenge has not been accepted by this timestamp, the challenge is considered expired. Exact numeric value in seconds in the contract is ${
                  challengeDetails?.lockTime?.toString() ?? "?"
                }`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={
                    challengeDetails?.lockTime
                      ? formatDate(
                          new Date(challengeDetails.lockTime.toNumber() * 1000)
                        )
                      : "Loading..."
                  }
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>

            <FormControl isReadOnly gridColumn={{ base: "span 2" }}>
              <FormLabel>{`Challenge Settlement period`}</FormLabel>
              <Tooltip
                hasArrow
                label={`Time period during which a settlement transaction can be sent to fetch ETH/USD price from chainlink and determine the winner. Can only be settled if challenged has been accepted. Exact numeric value in seconds in the contract is ${
                  challengeDetails?.settlementStartTime?.toString() ?? "?"
                } to ${challengeDetails?.settlementEndTime?.toString() ?? "?"}`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={
                    challengeDetails?.settlementStartTime &&
                    challengeDetails?.settlementEndTime
                      ? `${formatDate(
                          new Date(
                            challengeDetails.settlementStartTime.toNumber() *
                              1000
                          )
                        )} to ${formatDate(
                          new Date(
                            challengeDetails.settlementEndTime.toNumber() * 1000
                          )
                        )}`
                      : "Loading..."
                  }
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
              <FormHelperText>
                {`Settlement incentive to settle the challenge by sending a settlement transaction during the settlement period is ${
                  challengeDetails?.settlementFeePercent &&
                  challengeDetails?.settlementFeeMax &&
                  challengeDetails?.entryFee
                    ? calculateSettlementIncentive(
                        challengeDetails.settlementFeePercent,
                        challengeDetails.settlementFeeMax,
                        challengeDetails.entryFee
                      )
                    : "?"
                } ETH.`}
              </FormHelperText>
            </FormControl>

            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Creator address</FormLabel>
              <Tooltip
                hasArrow
                label={`Address of the creator of the challenge. `}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.creator ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>{`Creator's Prediction`}</FormLabel>
              <Tooltip
                hasArrow
                label={`Prediction of ETH/USD made by the creator of the challenge. The exact numeric value in the contract is ${
                  challengeDetails?.creatorPrediction?.toString() ?? "?"
                }`}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    variant="filled"
                    value={
                      challengeDetails?.creatorPrediction
                        ? utils.formatUnits(
                            challengeDetails.creatorPrediction,
                            8
                          )
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH/USD</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Challenger address</FormLabel>
              <Tooltip
                hasArrow
                label={`Address of the challenger who accepted the challenge. `}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.challenger ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>{`Challenger's Prediction`}</FormLabel>
              <Tooltip
                hasArrow
                label={`Prediction of ETH/USD made by the challenger. The exact numeric value in the contract is ${
                  challengeDetails?.challengerPrediction?.toString() ?? "?"
                }`}
                bg="green.600"
                color="white"
              >
                <InputGroup size="sm" variant="filled">
                  <Input
                    type="text"
                    variant="filled"
                    value={
                      challengeDetails?.challengerPrediction
                        ? utils.formatUnits(
                            challengeDetails.challengerPrediction,
                            8
                          )
                        : "Loading..."
                    }
                    size="sm"
                    bg="secondary.100"
                  />
                  <InputRightAddon bg="secondary.200">ETH/USD</InputRightAddon>
                </InputGroup>
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Is challenge settled?</FormLabel>
              <Tooltip
                hasArrow
                label={`The challenge is settled when a settlement transaction is sent during the settlement period which calls the oracle sets the winner. The challenge can be settled by anyone, including the participants to gain a settlement fee.`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.settled?.toString() ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Settled by</FormLabel>
              <Tooltip
                hasArrow
                label={`Address of the account that settled the challenge. If the challenge is not settled, this field will have the Zero address.`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.settledBy ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Is challenge active</FormLabel>
              <Tooltip
                hasArrow
                label={`The challenge is active when initialized. It can be cancelled by the creator IF the challenge has not been locked yet. Once the challenge is locked, it needs to be settled or expire.`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.active?.toString() ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
            <FormControl
              isReadOnly
              gridColumn={{ base: "span 2", lg: "span 1" }}
            >
              <FormLabel>Winner address</FormLabel>
              <Tooltip
                hasArrow
                label={`Address of the winner of the challenge. If the challenge is not settled, this field will have the Zero address.`}
                bg="green.600"
                color="white"
              >
                <Input
                  type="text"
                  variant="filled"
                  value={challengeDetails?.winner ?? "Loading..."}
                  size="sm"
                  bg="secondary.100"
                />
              </Tooltip>
            </FormControl>
          </SimpleGrid>
        </Stack>
      </CardBody>
    </Card>
  );
}

type ContractInfoProps = {
  ethPriceFeedDetails: EthPriceFeedDetails;
  challengeFactoryDetails: ChallengeFactoryDetails;
  challengeDetails: ChallengeDetails;
};
