import {
  Container,
  Heading,
  ListItem,
  List,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";

export default function HowItWorks() {
  return (
    <Container maxW="container.4xl" p={{ sm: 16, md: 20 }}>
      <Heading as="h1" size="xl" fontWeight={500} fontStyle="italic">
        How WagerWinz Works
      </Heading>
      <List py={4} spacing={4} stylePosition="inside">
        <ListItem>
          <Heading as="h2" size="lg" fontWeight={200}>
            Creating a Challenge
          </Heading>
          <OrderedList py={2} spacing={2} stylePosition="inside">
            <ListItem>
              Go to the Create page and connect your wallet to the website with
              the sepolia testnet network.
            </ListItem>
            <ListItem>
              Create a challenge using the Challenge Creator form.The challenge
              is created using a ChallengeFactory contract and the details of
              the contract are available on the Create page.
            </ListItem>
            <ListItem>
              Following parameters are required to create a challenge:
              <UnorderedList py={2} spacing={2} stylePosition="inside">
                <ListItem>
                  <b>Entry Fee</b> -- The fee which will be deposited to the
                  contract upon creation. The challenger will have to pay the
                  same entry fee.
                </ListItem>
                <ListItem>
                  <b>Challenge Lock Time</b> -- Anyone can challenge the creator
                  till the lock time if the challenge has not been accepted
                  already. Challenge can be cancelled by the creator if it has
                  not been accepted yet or if the it has not been accepted by
                  the lock time.
                </ListItem>
                <ListItem>
                  <b>Your Prediction</b> -- Enter your prediction of ETH/USD.
                  This value cannot be changed later and will be used to
                  determine the winner against the ETH/USD price feed value from
                  chainlink when the challenge is settled.
                </ListItem>
                <ListItem>
                  <b>Challenge Settlement Start Time</b> -- The time at which
                  the settlement period starts. If the challenge has been
                  accepted, the challenge can be settled by anyone for a small
                  incentive during the settlement period. The settlement end
                  time is calculated from the start time by the Factory
                  contract.
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              The above parameters will be validated by the Factory contract and
              upon successful creation, the challenge details will be displayed
              on the same page. Please copy and save the address of the
              challenge contract as this value is not stored anywhere (there is
              no backend) except the ethereum blockchain (Can be found through
              transaction logs on something like etherscan.){" "}
            </ListItem>
            <ListItem>
              Share the challenge address with someone so that they can
              challenge you!
            </ListItem>
          </OrderedList>
        </ListItem>
        <ListItem>
          <Heading as="h2" size="lg" fontWeight={200}>
            Accepting a Challenge
          </Heading>
          <OrderedList py={2} spacing={2} stylePosition="inside">
            <ListItem>
              Go to the View page and connect your wallet to the website with
              the sepolia testnet network.
            </ListItem>
            <ListItem>
              Enter the address of the challenge contract and click on the fetch
              button in the Challenge Details section. This should fetch all the
              contract details if the challenge contract address is valid.
            </ListItem>
            <ListItem>
              The <b>Entry Fee</b> for accepting the challenge is already fixed
              when the challenge contract is created.
            </ListItem>
            <ListItem>
              Enter <b>Your Prediction</b> of ETH/USD during the settlement
              period (available in the Challenge Details section along with
              other info). This value cannot be changed later and will be used
              to determine the winner against the ETH/USD price feed value from
              chainlink when the challenge is settled.
            </ListItem>
            <ListItem>
              Upon sending the Accept transaction, the challenge contract will
              validate the transaction based on your input parameters and
              existing state of the contract and update the Challenge details
              upon success.
            </ListItem>
          </OrderedList>
        </ListItem>
        <ListItem>
          <Heading as="h2" size="lg" fontWeight={200}>
            Settling a Challenge
          </Heading>
          <OrderedList py={2} spacing={2} stylePosition="inside">
            <ListItem>
              Go to the View page and connect your wallet to the website with
              the sepolia testnet network.
            </ListItem>
            <ListItem>
              Enter the address of the challenge contract and click on the fetch
              button in the Challenge Details section. This should fetch all the
              contract details if the challenge contract address is valid.
            </ListItem>
            <ListItem>
              Based on the state of the contract and settlement period, anyone
              can send a settle transaction for a small incentive.
            </ListItem>
            <ListItem>
              The settle transaction will validate the contract state and settle
              the challenge if the settlement period has started and the
              contract is not already settled. The price of ETH/USD from
              chainlink will be used to determine the winner and the contract
              will be updated accordingly.
            </ListItem>
            <ListItem>
              The creator can also <b>cancel</b> the challenge from here
              provided that:
              <UnorderedList py={2} spacing={2} stylePosition="inside">
                <ListItem>The challenge has not been accepted yet.</ListItem>
                <ListItem>
                  The creator is the one sending the cancel transaction.
                </ListItem>
              </UnorderedList>
              <ListItem>
                Upon successful cancellation, the entry fee will be refunded to
                the creator.
              </ListItem>
            </ListItem>
          </OrderedList>
        </ListItem>
        <ListItem>
          <Heading as="h2" size="lg" fontWeight={200}>
            Withdrawing from the Challenge
          </Heading>
          <OrderedList py={2} spacing={2} stylePosition="inside">
            <ListItem>
              Go to the View page and connect your wallet to the website with
              the sepolia testnet network.
            </ListItem>
            <ListItem>
              Enter the address of the challenge contract and click on the fetch
              button in the Challenge Details section. This should fetch all the
              contract details if the challenge contract address is valid.
            </ListItem>
            <ListItem>
              Only the creator and/or the challenger can withdraw ETH from the
              challenge contract based on the following conditions:
              <UnorderedList py={2} spacing={2} stylePosition="inside">
                <ListItem>
                  If the challenge has been settled, only the winner can
                  withdraw the winnings (Remaining value locked in the
                  contract).
                </ListItem>
                <ListItem>
                  If the challenge has not been settled, and the settlement
                  period has not ended, neither participants can withdraw their
                  entry fee and must wait for either the challenge to be settled
                  (or settle it themselves) or the settlement period to end.
                </ListItem>
                <ListItem>
                  If the challenge has not been settled till the settlement end
                  time, i.e. the challenge expired without settlement, both
                  participants can withdraw their entry fee only once by sending
                  the withdraw transaction.
                </ListItem>
              </UnorderedList>
            </ListItem>
          </OrderedList>
        </ListItem>
      </List>
    </Container>
  );
}
