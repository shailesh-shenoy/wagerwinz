import { ChallengeDetails } from "@/components/challenge/types";
import { EthPriceFeedDetails } from "@/components/pricefeed/types";
import ChallengeInteractor from "@/components/view-challenge/ChallengeInteractor";
import ViewChallengeInfo from "@/components/view-challenge/ViewChallengeInfo";
import {
  useAggregatorV3InterfaceLatestRoundData,
  useChallengeGetChallengeDetails,
} from "@/generated";
import { Box, SimpleGrid, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function ViewChallenge() {
  const ethPriceFeedAddress =
    process.env.NEXT_PUBLIC_CHAINLINK_ETHUSD_CONTRACT_ADDRESS || "";

  //* Challenge info state
  const [ethPriceFeedDetails, setEthPriceFeedDetails] =
    useState<EthPriceFeedDetails>({ ethPriceFeedAddress: ethPriceFeedAddress });

  const [challengeDetails, setChallengeDetails] = useState<ChallengeDetails>({
    challengeAddress: "",
  });

  const toast = useToast();

  //* Wagmi autogenerated hook for eth price feed
  const { refetch: refetchEthFeed } = useAggregatorV3InterfaceLatestRoundData({
    // @ts-expect-error
    address: ethPriceFeedAddress,
    enabled: false,
    onSuccess: (data) => {
      console.log("ETH/USD Price Feed Data: ", data);
      setEthPriceFeedDetails({
        ...ethPriceFeedDetails,
        ethPriceFeedAddress: ethPriceFeedAddress,
        ethUsdPrice: data?.answer || 0,
        lastUpdatedAt: data?.updatedAt || 0,
        refetchEthFeed: refetchEthFeed,
      });
    },
  });

  //* Wagmi autogenerated hook for challenge details
  const { refetch: refetchChallengeDetails } = useChallengeGetChallengeDetails({
    // @ts-expect-error
    address: challengeDetails?.challengeAddress,
    enabled: false,
    onSuccess: (data) => {
      console.log("Challenge Details called: ", data);
      setChallengeDetails({
        ...challengeDetails,
        owner: data?._owner || ethers.constants.AddressZero,
        startBlock: data?._startBlock || 0,
        startTime: data?._startTime || 0,
        entryFee: data?._entryFee || 0,
        lockTime: data?._lockTime || 0,
        settlementStartTime: data?._settlementStartTime || 0,
        settlementEndTime: data?._settlementEndTime || 0,
        creator: data?._creator || ethers.constants.AddressZero,
        creatorPrediction: data?._creatorPrediction || 0,
        challenger: data?._challenger || ethers.constants.AddressZero,
        challengerPrediction: data?._challengerPrediction || 0,
        settled: data?._settled || false,
        settledBy: data?._settledBy || ethers.constants.AddressZero,
        active: data?._active || false,
        winner: data?._winner || ethers.constants.AddressZero,
        creatorWithdrawn: data?._creatorWithdrawn || false,
        challengerWithdrawn: data?._challengerWithdrawn || false,
        settlementFeePercent: data?._SETTLEMENT_FEE_PERCENT || 0,
        settlementFeeMax: data?._SETTLEMENT_FEE_MAX || 0,
        currentBlockTimestamp: data?._currentTimestamp || 0,
        challengeStatus: data?._challengeStatus || "",
        refetchChallengeDetails: refetchChallengeDetails,
      });
      toast({
        title: "Challenge Details Updated",
        description: `The challenge details for address ${
          challengeDetails?.challengeAddress ?? "?"
        } have been updated.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error while fetching challenge details",
        description: `There was an error while fetching challenge details for address ${
          challengeDetails?.challengeAddress ?? "?"
        } -- ${
          error?.reason || error?.cause || error?.message?.substring(0, 240)
        }.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    refetchEthFeed();
    if (challengeDetails?.challengeAddress) {
      refetchChallengeDetails();
    }
  }, [
    refetchEthFeed,
    refetchChallengeDetails,
    challengeDetails?.challengeAddress,
  ]);

  return (
    <Box bg="secomdary.100" p={10} minHeight="90vh">
      <SimpleGrid
        height="100%"
        spacing={4}
        templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
      >
        <ViewChallengeInfo
          ethPriceFeedDetails={ethPriceFeedDetails}
          challengeDetails={challengeDetails}
          setChallengeDetails={setChallengeDetails}
        />
        <ChallengeInteractor
          challengeDetails={challengeDetails}
          setChallengeDetails={setChallengeDetails}
        />
      </SimpleGrid>
    </Box>
  );
}
