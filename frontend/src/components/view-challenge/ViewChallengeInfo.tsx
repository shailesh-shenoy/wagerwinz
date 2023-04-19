import {
  Card,
  useToast,
  CardHeader,
  Heading,
  Divider,
  CardBody,
  StackDivider,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import PriceFeedGrid from "../pricefeed/PriceFeedGrid";
import ChallengeDetailsGrid from "../challenge/ChallengeDetailsGrid";
import { EthPriceFeedDetails } from "../pricefeed/types";
import { ChallengeDetails } from "../challenge/types";

export default function ViewChallengeInfo({
  ethPriceFeedDetails,
  challengeDetails,
  setChallengeDetails,
}: ViewChallengeInfoProps) {
  const toast = useToast();
  return (
    <Card rounded="xl">
      <CardHeader>
        <Heading as="h2" size="lg" textAlign="center" fontWeight={400}>
          CHALLENGE INFO
        </Heading>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Stack direction="column" spacing={4} divider={<StackDivider />}>
          <PriceFeedGrid ethPriceFeedDetails={ethPriceFeedDetails} />
          <ChallengeDetailsGrid
            challengeDetails={challengeDetails}
            setChallengeDetails={setChallengeDetails}
          />
        </Stack>
      </CardBody>
    </Card>
  );
}

export type ViewChallengeInfoProps = {
  ethPriceFeedDetails: EthPriceFeedDetails;
  challengeDetails: ChallengeDetails;
  setChallengeDetails: (challengeDetails: ChallengeDetails) => void;
};
