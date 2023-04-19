import { RepeatIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  Stack,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { utils } from "ethers";
import { ChallengeDetails } from "./types";
import {
  calculateSettlementIncentive,
  formatDateFromTimestampInSeconds,
} from "@/utilities/helpers";
import { useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  useChallengeCancelChallenge,
  useChallengeChallengeCancelledEvent,
  useChallengeChallengeSettledEvent,
  useChallengeSettleChallenge,
  usePrepareChallengeCancelChallenge,
  usePrepareChallengeSettleChallenge,
} from "@/generated";

export default function ChallengeSettleGrid({
  challengeDetails,
}: ChallengeSettleGridProps) {
  //* Local state
  const [validSettleChallenge, setValidSettleChallenge] =
    useState<boolean>(false);
  const [validCancelChallenge, setValidCancelChallenge] =
    useState<boolean>(false);

  const toast = useToast();

  //* Wagmi autogenerated usePrepareContractWrite hook
  const {
    config: challengeSettleConfig,
    isLoading: isSettleValidateLoading,
    refetch: refetchChallengeSettleValidate,
  } = usePrepareChallengeSettleChallenge({
    // @ts-expect-error
    address: challengeDetails?.challengeAddress ?? "",
    enabled: false,
    onError: (error: any) => {
      setValidSettleChallenge(false);
      toast({
        title: "Cannot settle challenge",
        description: `Contract will throw the following error while settling the challenge -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      setValidSettleChallenge(true);
      toast({
        title: "Challenge can be settled",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated useContractWrite hook
  const {
    data: challengeSettleData,
    isLoading: isChallengeSettleLoading,
    write: settleChallenge,
  } = useChallengeSettleChallenge({
    ...challengeSettleConfig,
    onError: (error: any) => {
      toast({
        title: "Error while sending settle challenge transaction",
        description: `Error thrown while settling the challenge -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Challenge settle transaction sent",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    },
  });

  //* Wait for settle transaction hook
  const { isLoading: isSettleTxLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: challengeSettleData?.hash,
    onSuccess: (data) => {
      toast({
        title: "Challenge settle transaction confirmed",
        description: `Challenge settle confirmed with transaction hash ${data.transactionHash}`,
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Challenge settle transaction failed",
        description: `Challenge settle failed with error -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated Challenge settled event hook
  useChallengeChallengeSettledEvent({
    // @ts-expect-error
    address: challengeDetails?.challengeAddress ?? "",
    listener(_settledBy, _winner, _ethUsdPrice, _settlementFee, _settledAt) {
      challengeDetails?.refetchChallengeDetails?.();
      console.log("Challenge settled");
      toast({
        title: "Challenge settled!",
        description: `Challenge settled by ${_settledBy} at ${formatDateFromTimestampInSeconds(
          _settledAt?.toNumber()
        )}, earning a settlement fee of ${utils.formatEther(
          _settlementFee
        )} ETH. The challenge was won by ${_winner}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated usePrepareContractWrite hook for cancel challenge
  const {
    config: challengeCancelConfig,
    isLoading: isCancelValidateLoading,
    refetch: refetchChallengeCancelValidate,
  } = usePrepareChallengeCancelChallenge({
    // @ts-expect-error
    address: challengeDetails?.challengeAddress ?? "",
    enabled: false,
    onError: (error: any) => {
      setValidCancelChallenge(false);
      toast({
        title: "Cannot Cancel challenge",
        description: `Contract will throw the following error while Cancelling the challenge -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      setValidCancelChallenge(true);
      toast({
        title: "Challenge can be Cancelled",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated useContractWrite hook for cancel challenge
  const {
    data: challengeCancelData,
    isLoading: isChallengeCancelLoading,
    write: cancelChallenge,
  } = useChallengeCancelChallenge({
    ...challengeCancelConfig,
    onError: (error: any) => {
      toast({
        title: "Error while sending Cancel challenge transaction",
        description: `Error thrown while Cancelling the challenge -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Challenge Cancel transaction sent",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    },
  });

  //* Wait for cancel transaction hook
  const { isLoading: isCancelTxLoading } = useWaitForTransaction({
    confirmations: 1,
    hash: challengeCancelData?.hash,
    onSuccess: (data) => {
      toast({
        title: "Challenge Cancel transaction confirmed",
        description: `Challenge Cancel confirmed with transaction hash ${data.transactionHash}`,
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Challenge Cancel transaction failed",
        description: `Challenge Cancel failed with error -- ${
          error?.reason || error?.message
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  //* Wagmi autogenerated Challenge Cancelled event hook
  useChallengeChallengeCancelledEvent({
    // @ts-expect-error
    address: challengeDetails?.challengeAddress ?? "",
    listener(_cancelledBy, _cancelledAt) {
      challengeDetails?.refetchChallengeDetails?.();
      console.log("Challenge cancelled");
      toast({
        title: "Challenge cancelled!",
        description: `Challenge cancelled by ${_cancelledBy} at ${formatDateFromTimestampInSeconds(
          _cancelledAt?.toNumber()
        )}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  return (
    <Stack direction="column" spacing={4}>
      <Heading as="h3" size="md" gridColumn="span 2" fontWeight={100}>
        Settle or Cancel challenge
      </Heading>
      <ButtonGroup gap={4}>
        <Tooltip
          hasArrow
          label="Validate settle challenge transaction before settling the challenge"
          bg="blue.600"
          color="white"
        >
          <IconButton
            aria-label="Validate challenge settle transaction"
            colorScheme="blue"
            icon={<RepeatIcon />}
            isLoading={isSettleValidateLoading}
            onClick={validateSettleChallenge}
          />
        </Tooltip>
        <Tooltip
          hasArrow
          label={`Settle challenge at address ${
            challengeDetails?.challengeAddress || "?"
          } for a settlement fee of ${
            challengeDetails?.settlementFeePercent &&
            challengeDetails?.settlementFeeMax &&
            challengeDetails?.entryFee
              ? calculateSettlementIncentive(
                  challengeDetails.settlementFeePercent,
                  challengeDetails.settlementFeeMax,
                  challengeDetails.entryFee
                )
              : "?"
          } ETH.
            `}
          bg="blue.600"
          color="white"
        >
          <Button
            onClick={handleSettleChallenge}
            colorScheme={"blue"}
            isDisabled={
              !validSettleChallenge ||
              isChallengeSettleLoading ||
              isSettleTxLoading
            }
            isLoading={isChallengeSettleLoading || isSettleTxLoading}
            alignSelf="center"
          >
            Settle Challenge
          </Button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup gap={4}>
        <Tooltip
          hasArrow
          label="Validate cancel challenge transaction before cancelling the challenge"
          bg="red.600"
          color="white"
        >
          <IconButton
            aria-label="Validate challenge cancel transaction"
            colorScheme="red"
            icon={<RepeatIcon />}
            isLoading={isCancelValidateLoading}
            onClick={validateCancelChallenge}
          />
        </Tooltip>
        <Tooltip
          hasArrow
          label={`Cancel challenge at address ${
            challengeDetails?.challengeAddress || "?"
          }.`}
          bg="red.600"
          color="white"
        >
          <Button
            onClick={handleCancelChallenge}
            colorScheme={"red"}
            isDisabled={
              !validCancelChallenge ||
              isChallengeCancelLoading ||
              isCancelTxLoading
            }
            isLoading={isChallengeCancelLoading || isCancelTxLoading}
            alignSelf="center"
          >
            Cancel Challenge
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Stack>
  );

  async function validateSettleChallenge() {
    await refetchChallengeSettleValidate();
  }

  function handleSettleChallenge() {
    settleChallenge?.();
  }

  async function validateCancelChallenge() {
    await refetchChallengeCancelValidate();
  }

  function handleCancelChallenge() {
    cancelChallenge?.();
  }
}

export type ChallengeSettleGridProps = {
  challengeDetails: ChallengeDetails;
};