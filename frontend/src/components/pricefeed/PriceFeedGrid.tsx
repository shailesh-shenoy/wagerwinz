import { formatDate } from "@/utilities/helpers";
import { RepeatIcon } from "@chakra-ui/icons";
import {
  SimpleGrid,
  Heading,
  Tooltip,
  IconButton,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
} from "@chakra-ui/react";
import { EthPriceFeedDetails } from "./types";
import { utils } from "ethers";

export default function PriceFeedGrid({
  ethPriceFeedDetails,
}: PriceFeedGridProps) {
  return (
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
            colorScheme="yellow"
            variant="solid"
            size="sm"
            onClick={ethPriceFeedDetails?.refetchEthFeed}
            aria-label="Refresh ETH/USD Price Data"
            icon={<RepeatIcon />}
          />
        </Tooltip>
      </Heading>
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
      <FormControl isReadOnly gridColumn={{ base: "span 2", lg: "span 1" }}>
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
  );
}

export type PriceFeedGridProps = {
  ethPriceFeedDetails: EthPriceFeedDetails;
};
