import { RepeatIcon } from "@chakra-ui/icons";
import {
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
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { utils } from "ethers";
import { ChallengeDetails } from "./types";
import {
  calculateSettlementIncentive,
  formatDate,
  formatDateFromTimestampInSeconds,
} from "@/utilities/helpers";
import { useEffect, useState } from "react";

export default function ChallengeDetailsGrid({
  challengeDetails,
  setChallengeDetails,
}: ChallengeDetailsGridProps) {
  const [challengeInput, setChallengeInput] = useState<string>("");
  const toast = useToast();
  useEffect(() => {
    console.log("UE challengeDetails");
    if (challengeDetails?.challengeAddress) {
      setChallengeInput(challengeDetails.challengeAddress);
    }
  }, [challengeDetails?.challengeAddress]);

  return (
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
            colorScheme="yellow"
            variant="solid"
            size="sm"
            onClick={() => {
              if (utils.isAddress(challengeInput)) {
                setChallengeDetails({
                  ...challengeDetails,
                  challengeAddress: challengeInput,
                });
                challengeDetails?.refetchChallengeDetails?.();
              } else {
                toast({
                  title: "Invalid Challenge Address",
                  description: "Please enter a valid challenge address.",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
                challengeDetails?.refetchChallengeDetails?.();
                setChallengeInput(challengeDetails?.challengeAddress ?? "");
              }
            }}
            aria-label="Refresh ETH/USD Price Data"
            icon={<RepeatIcon />}
          />
        </Tooltip>
      </Heading>
      <FormControl gridColumn={{ base: "span 2" }}>
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
            variant="outline"
            type="text"
            value={challengeInput ?? "Loading..."}
            onChange={(event) => setChallengeInput(event.target.value.trim())}
            size="md"
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
      <FormControl isReadOnly gridColumn={{ base: "span 2" }}>
        <FormLabel>Challenge status</FormLabel>
        <Tooltip
          hasArrow
          label={`Status of the challenge contract. The challenge can be in one of the following states: INACTIVE, SETTLED, CHALLENGEABLE, VOID, ACCEPTED, LOCKED, SETTLEABLE, or EXPIRED.`}
          bg="green.600"
          color="white"
        >
          <Input
            type="text"
            variant="filled"
            value={challengeDetails?.challengeStatus ?? "Loading..."}
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>

      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
        <FormLabel>Current Block Timestamp</FormLabel>
        <Tooltip
          hasArrow
          label={`The block.timestamp value is not 100% accurate and may not be exactly the same as local time. Current block timestamp in seconds is ${
            challengeDetails?.currentBlockTimestamp?.toString() ?? "?"
          }`}
          bg="green.600"
          color="white"
        >
          <Input
            type="text"
            variant="filled"
            value={
              challengeDetails?.currentBlockTimestamp
                ? formatDateFromTimestampInSeconds(
                    challengeDetails.currentBlockTimestamp.toNumber()
                  )
                : "Loading..."
            }
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>

      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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

      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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

      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
                      challengeDetails.settlementStartTime.toNumber() * 1000
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

      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
                  ? utils.formatUnits(challengeDetails.creatorPrediction, 8)
                  : "Loading..."
              }
              size="sm"
              bg="secondary.100"
            />
            <InputRightAddon bg="secondary.200">ETH/USD</InputRightAddon>
          </InputGroup>
        </Tooltip>
      </FormControl>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
                  ? utils.formatUnits(challengeDetails.challengerPrediction, 8)
                  : "Loading..."
              }
              size="sm"
              bg="secondary.100"
            />
            <InputRightAddon bg="secondary.200">ETH/USD</InputRightAddon>
          </InputGroup>
        </Tooltip>
      </FormControl>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
            value={
              challengeDetails?.settled?.toString().toUpperCase() ??
              "Loading..."
            }
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
        <FormLabel>Is challenge active?</FormLabel>
        <Tooltip
          hasArrow
          label={`The challenge is active when initialized. It can be cancelled by the creator IF the challenge has not been locked yet. Once the challenge is locked, it needs to be settled or expire.`}
          bg="green.600"
          color="white"
        >
          <Input
            type="text"
            variant="filled"
            value={
              challengeDetails?.active?.toString().toUpperCase() ?? "Loading..."
            }
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
        <FormLabel>Has creator withdrawn?</FormLabel>
        <Tooltip
          hasArrow
          label={`If the challenge has not been settled before the settlement time, the creator can withdraw their wager only once and this field will be true.`}
          bg="green.600"
          color="white"
        >
          <Input
            type="text"
            variant="filled"
            value={
              challengeDetails?.creatorWithdrawn?.toString().toUpperCase() ??
              "Loading..."
            }
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
        <FormLabel>Has challenger withdrawn?</FormLabel>
        <Tooltip
          hasArrow
          label={`If the challenge has not been settled before the settlement time, the challenger can withdraw their wager only once and this field will be true.`}
          bg="green.600"
          color="white"
        >
          <Input
            type="text"
            variant="filled"
            value={
              challengeDetails?.challengerWithdrawn?.toString().toUpperCase() ??
              "Loading..."
            }
            size="sm"
            bg="secondary.100"
          />
        </Tooltip>
      </FormControl>
    </SimpleGrid>
  );
}

export type ChallengeDetailsGridProps = {
  challengeDetails: ChallengeDetails;
  setChallengeDetails: (challengeDetails: ChallengeDetails) => void;
};
