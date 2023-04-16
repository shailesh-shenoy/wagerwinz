import { CHALLENGE_FACTORY_ADDRESS } from "@/artifacts/contracts/challengeFactoryAddress";
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
import { useState } from "react";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from "wagmi";
import { utils } from "ethers";
import { RepeatIcon } from "@chakra-ui/icons";

export default function ChallengeCreator({
  minEntryFee,
}: ChallengeCreatorProps) {
  //* Form state
  const [validChallenge, setValidChallenge] = useState<boolean>(false);

  const [creatorPrediction, setCreatorPrediction] = useState("0");
  const [entryFee, setEntryFee] = useState("0");

  const [challengeAddress, setChallengeAddress] = useState<string>("");

  const toast = useToast();

  //* Get connected wallet address
  const { isConnected, address: creatorAddress } = useAccount();

  //* Prepare contract write hook
  const {
    config: challengeCreateConfig,
    isLoading: isChallengeValidateLoading,
    refetch: refetchChallengeCreate,
  } = usePrepareContractWrite({
    address: CHALLENGE_FACTORY_ADDRESS,
    abi: challengeFactory.abi,
    functionName: "createChallenge",
    args: [utils.parseUnits(creatorPrediction || "0", 8)],
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
    onSuccess: (data: any) => {
      setValidChallenge(true);
      toast({
        title: "Challenge parameters validated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    enabled: false,
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
    onSuccess: (data: any) => {
      console.log(data);
      toast({
        title: "Challenge creation request sent",
        description: `Transaction hash: ${data?.hash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  //* Read challenge address
  const { data: activeChallengeData, refetch: refetchActiveChallenge } =
    useContractRead({
      address: CHALLENGE_FACTORY_ADDRESS,
      abi: challengeFactory.abi,
      functionName: "activeChallenges",
      args: [creatorAddress],
      enabled: false,
      onSuccess: (data: any) => {
        setChallengeAddress(data);
        toast({
          title: `Challenge deployed at address ${data}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error fetching challenge address",
          description: error?.reason || error?.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });

  // Check TX for mint function
  const {
    isSuccess: txSuccess,
    error: txError,
    isLoading: isTxLoading,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: challengeCreateData?.hash,
    onSuccess: (data) => {
      console.log(data);
      refetchActiveChallenge();
      toast({
        title: "Challenge created successfully",
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
                  entry fee. Minimum Entry Fee is ${minEntryFee || "?"} ETH.`}
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
  minEntryFee: number;
};
