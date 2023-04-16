import { RepeatIcon } from "@chakra-ui/icons";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";
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
  Tooltip,
} from "@chakra-ui/react";

export default function ContractInfo({
  ethPriceFeedAddress,
  ethUsdPrice,
  minEntryFee,
  challengeFactoryAddress,
  refetchEthFeed,
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
        <FormControl isReadOnly>
          <FormLabel size="sm">ChallengeFactory Address</FormLabel>
          <Tooltip
            hasArrow
            label="Address on the ChallengeFactory contract used to create and
                deploy challenges with specified rules."
            bg="green.600"
            color="white"
          >
            <Input
              variant="filled"
              type="text"
              bg="secondary.100"
              value={challengeFactoryAddress || "Loading..."}
              size="sm"
            />
          </Tooltip>
          <FormHelperText>
            View on Etherscan:{" "}
            <Link
              href="https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306"
              target="_blank"
              color="green.800"
            >
              https://etherscan.io/address/0x5FbDB2315678afecb367f032d93F642f64180aa3
            </Link>
          </FormHelperText>
        </FormControl>

        <FormControl isReadOnly mt={4}>
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
                value={minEntryFee || "Loading..."}
                size="sm"
                bg="secondary.100"
              />
              <InputRightAddon bg="secondary.200">ETH</InputRightAddon>
            </InputGroup>
          </Tooltip>
        </FormControl>

        <FormControl isReadOnly mt={4}>
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
                value={ethUsdPrice || "Loading..."}
                size="sm"
                bg="secondary.100"
              />
              <InputRightAddon bg="secondary.200">
                USD{" "}
                <IconButton
                  icon={<RepeatIcon />}
                  size="xs"
                  variant="ghost"
                  colorScheme="green"
                  aria-label="Refresh ETH/USD Price"
                  onClick={refetchEthFeed}
                  ml={2}
                />
              </InputRightAddon>
            </InputGroup>
          </Tooltip>
        </FormControl>
      </CardBody>
    </Card>
  );
}

type ContractInfoProps = {
  ethPriceFeedAddress: string;
  ethUsdPrice: number | undefined;
  minEntryFee: number | undefined;
  challengeFactoryAddress: string;
  refetchEthFeed: () => void;
};
