import { CHALLENGE_FACTORY_ADDRESS } from "@/artifacts/contracts/challengeFactoryAddress";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Card,
  CardHeader,
  Heading,
  Divider,
  CardBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  useToast,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";
import { useContractWrite, useWaitForTransaction, useAccount } from "wagmi";
import { BigNumber, utils } from "ethers";
import { RepeatIcon } from "@chakra-ui/icons";
import { useChallengeFactoryChallengeCreatedEvent } from "../../generated";
import {
  useChallengeFactory,
  useChallengeFactoryCreateChallenge,
  usePrepareChallengeFactoryCreateChallenge,
} from "@/generated";
import { ChallengeFactoryDetails, ChallengeDetails } from "./types";
import { formatDateFromTimestampInSeconds } from "@/utilities/helpers";

export default function ChallengeCreator({
  challengeFactoryDetails,
  challengeDetails,
  setChallengeDetails,
}: ChallengeCreatorProps) {
  //* Form state
  const [validChallenge, setValidChallenge] = useState<boolean>(false);

  const [creatorPrediction, setCreatorPrediction] = useState("0");
  const [entryFee, setEntryFee] = useState("0");
  const [lockTime, setLockTime] = useState<any>();
  const [settlementTime, setSettlementTime] = useState<any>();

  const toast = useToast();
  useEffect(() => {
    setLockTime(new Date());
    setSettlementTime(new Date());
  }, []);

  //* Get connected wallet address
  const { isConnected, address: creatorAddress } = useAccount();

  //* Wagmi autogenerate usePrepareContractWrite hook
  const {
    config: challengeCreateConfig,
    isLoading: isChallengeValidateLoading,
    refetch: refetchChallengeCreate,
  } = usePrepareChallengeFactoryCreateChallenge({
    address: CHALLENGE_FACTORY_ADDRESS,
    enabled: false,
    args: [
      utils.parseUnits(creatorPrediction || "0", 8),
      BigNumber.from(Math.floor(lockTime?.getTime() / 1000) || 0),
      BigNumber.from(Math.floor(settlementTime?.getTime() / 1000) || 0),
    ],
    overrides: {
      value: utils.parseEther(entryFee || "0"),
    },
    onError: (error: any) => {
      setValidChallenge(false);
      toast({
        title: "Invalid challenge parameters",
        description: `Contract will throw the following error -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      setValidChallenge(true);
      console.log(data.address);
      toast({
        title: "Challenge parameters validated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  //* Contract write hook
  const {
    data: challengeCreateData,
    isLoading: isChallengeCreationLoading,
    write: createChallenge,
  } = useContractWrite({
    ...challengeCreateConfig,
    onError: (error: any) => {
      toast({
        title: "Error Sending the challenge transaction",
        description: error?.reason || error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Challenge creation request sent",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated useEvent hook
  useChallengeFactoryChallengeCreatedEvent({
    address: CHALLENGE_FACTORY_ADDRESS,
    listener(
      _creatorAddress,
      _challengeAddress,
      _lockTime,
      _entryFee,
      _settlementStartTime,
      _settlementEndTime,
      _creatorPrediction
    ) {
      if (_creatorAddress === creatorAddress) {
        setChallengeDetails({
          ...challengeDetails,
          challengeAddress: _challengeAddress,
        });
        console.log("Creator address: ", _creatorAddress);
        console.log("Challenge address: ", _challengeAddress);
        console.log("Lock time: ", _lockTime);
        console.log("Entry fee: ", _entryFee);
        console.log("Settlement start time: ", _settlementStartTime);
        console.log("Settlement end time: ", _settlementEndTime);
        console.log("Creator prediction: ", _creatorPrediction);
        toast({
          title: "Challenge created successfully",
          description: `Challenge address: ${_challengeAddress}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });

  // Check TX for Challenge Creation
  const { isLoading: isTxLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: challengeCreateData?.hash,
    onSuccess: (data) => {
      if (data?.transactionHash) {
        setChallengeDetails({
          ...challengeDetails,
          txHash: data?.transactionHash,
        });
      }
      toast({
        title: "Challenge creation transaction confirmed",
        description: `Transaction hash: ${data?.transactionHash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating challenge",
        description: error?.reason || error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Card rounded="2xl">
      <CardHeader>
        <Heading as="h1" size="lg" textAlign="center" fontWeight={400}>
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
              onChange={(event) => {
                setCreatorPrediction(event.target.value);
              }}
            />
            <FormHelperText>Enter your prediction of ETH/USD</FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Your wager</FormLabel>
            <Input
              variant="outline"
              type="number"
              value={entryFee}
              onChange={(event) => {
                setEntryFee(event.target.value);
              }}
            />
            <FormHelperText>
              {`Enter your wager in ETH. This price will be sent to the
                  challenge contract and locked when a challenger pays the same
                  entry fee. Minimum Entry Fee is ${
                    challengeFactoryDetails?.minEntryFee
                      ? utils.formatEther(challengeFactoryDetails.minEntryFee)
                      : "?"
                  } ETH.`}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Lock Date and Time</FormLabel>
            <DatePicker
              selected={lockTime}
              showTimeInput
              onChange={(date) => {
                setLockTime(date || new Date());
              }}
              dateFormat="Pp"
              timeFormat="p"
              shouldCloseOnSelect={false}
            />
            <FormHelperText>
              {`Enter the date and time when the challenge will be locked. The timestamp at which the challenge will lock is ${
                Math.floor(lockTime?.getTime() / 1000) || "?"
              }. The lock time should be between ${
                challengeFactoryDetails?.minChallengeDuration
                  ? formatDateFromTimestampInSeconds(
                      Math.floor(Date.now() / 1000) +
                        challengeFactoryDetails.minChallengeDuration.toNumber()
                    )
                  : "?"
              } and ${
                challengeFactoryDetails?.maxChallengeDuration
                  ? formatDateFromTimestampInSeconds(
                      Math.floor(Date.now() / 1000) +
                        challengeFactoryDetails.maxChallengeDuration.toNumber()
                    )
                  : "?"
              }.`}
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Settlement Date and Time</FormLabel>
            <DatePicker
              selected={settlementTime}
              showTimeInput
              onChange={(date) => {
                setSettlementTime(date || new Date());
              }}
              dateFormat="Pp"
              timeFormat="p"
              shouldCloseOnSelect={false}
            />
            <FormHelperText>
              {`Enter the date and time when the settlement period begins. During the settlement period, anyone can settle the challenge. The timestamp at which the challenge settlement period starts is ${
                Math.floor(settlementTime?.getTime() / 1000) || "?"
              }. The settlement period should be between ${
                lockTime && challengeFactoryDetails?.minLockDuration
                  ? formatDateFromTimestampInSeconds(
                      Math.floor(lockTime?.getTime() / 1000) +
                        challengeFactoryDetails.minLockDuration.toNumber()
                    )
                  : "?"
              } and ${
                lockTime && challengeFactoryDetails?.maxLockDuration
                  ? formatDateFromTimestampInSeconds(
                      Math.floor(lockTime?.getTime() / 1000) +
                        challengeFactoryDetails.maxLockDuration.toNumber()
                    )
                  : "?"
              }.`}
            </FormHelperText>
          </FormControl>
          <ButtonGroup gap={4}>
            <Tooltip
              hasArrow
              label="Validate request parameters"
              bg="green.600"
              color="white"
            >
              <IconButton
                aria-label="Validate challenge parameters"
                colorScheme="green"
                icon={<RepeatIcon />}
                isLoading={isChallengeValidateLoading}
                onClick={handleValidateChallenge}
              />
            </Tooltip>
            <Tooltip
              hasArrow
              label={`Create challenge with ${entryFee} ETH entry fee and ${creatorPrediction} ETH/USD prediction`}
              bg="green.600"
              color="white"
            >
              <Button
                type="submit"
                colorScheme={isTxLoading ? "blue" : "primary"}
                isDisabled={
                  !validChallenge || isChallengeCreationLoading || isTxLoading
                }
                isLoading={isChallengeCreationLoading || isTxLoading}
                alignSelf="center"
              >
                Create Challenge
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Stack>
      </CardBody>
    </Card>
  );

  async function handleChallengeCreation(event: any) {
    event.preventDefault();
    createChallenge?.();
  }

  async function handleValidateChallenge() {
    await refetchChallengeCreate();
  }
}

export type ChallengeCreatorProps = {
  challengeFactoryDetails: ChallengeFactoryDetails;
  challengeDetails: ChallengeDetails;
  setChallengeDetails: (challengeDetails: ChallengeDetails) => void;
};
