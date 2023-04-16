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
import { useEffect, useState } from "react";
import chainlinkPriceFeed from "@/artifacts/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/AggregatorV3Interface.json";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import ContractInfo from "@/components/create-a-challenge/ContractInfo";
import { CHALLENGE_FACTORY_ADDRESS } from "@/artifacts/contracts/challengeFactoryAddress";
import { chainlink } from "@/types/typechain";
import { BigNumber, utils } from "ethers";
import ChallengeCreator from "@/components/create-a-challenge/ChallengeCreator";

export default function CreateChallenge() {
  //* State and env variables

  //* Contract info state
  const [ethUsdPrice, setEthUsdPrice] = useState<number>(0);
  const [minEntryFee, setMinEntryFee] = useState<number>(0);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState<Date>();
  const ethPriceFeedAddress =
    process.env.NEXT_PUBLIC_CHAINLINK_ETHUSD_CONTRACT_ADDRESS || "";

  //* Wagmi hooks and configuration to set up eth price feed
  const {
    data: ethFeedData,
    //? isError,
    //? isLoading,
    error: ethFeedError,
    refetch: refetchEthFeed,
  } = useContractRead({
    // @ts-expect-error: Ignore as ethPriceFeedAddress is a proper address loaded from env
    address: ethPriceFeedAddress,
    abi: chainlinkPriceFeed.abi,
    functionName: "latestRoundData",
    enabled: false,
    onSuccess: (data: any) => {
      const ethPriceInUsd = data?.answer?.toNumber() / 10 ** 8;
      setEthUsdPrice(ethPriceInUsd);
      console.log("ethPriceInUsd", ethPriceInUsd);
      const priceUpdatedAt = new Date(data?.updatedAt?.toNumber() * 1000);
      setPriceUpdatedAt(priceUpdatedAt);
    },
  });

  //* Wagmi hooks and configuration to set up challenge factory
  const { data: challengeFactoryData, refetch: refetchChallengeFactory } =
    useContractRead({
      address: CHALLENGE_FACTORY_ADDRESS,
      abi: challengeFactory.abi,
      functionName: "minEntryFee",
      enabled: false,
      onSuccess: (data: any) => {
        const minEntryFee = Number(utils.formatEther(data));
        setMinEntryFee(minEntryFee);
      },
    });

  useEffect(() => {
    refetchEthFeed();
    refetchChallengeFactory();
    console.log("UE called");
  }, [refetchEthFeed, refetchChallengeFactory]);

  return (
    <Box bg="secondary.100" p={10} minHeight="90vh">
      <SimpleGrid
        height="100%"
        spacing={4}
        templateColumns={{ sm: "1fr", md: "1fr 1fr" }}
      >
        <ContractInfo
          ethPriceFeedAddress={ethPriceFeedAddress}
          ethUsdPrice={ethUsdPrice}
          minEntryFee={minEntryFee}
          challengeFactoryAddress={CHALLENGE_FACTORY_ADDRESS}
          refetchEthFeed={refetchEthFeed}
        />
        <ChallengeCreator minEntryFee={minEntryFee} />
      </SimpleGrid>
    </Box>
  );
}
