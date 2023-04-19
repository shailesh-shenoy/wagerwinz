import { Container, Heading, Text } from "@chakra-ui/react";

export default function About() {
  return (
    <Container maxW="container.4xl" p={{ sm: 16, md: 20 }}>
      <Heading as="h1" size="xl" fontWeight={500}>
        About WagerWinz
      </Heading>
      <Text py={4}>
        Welcome to WagerWinz, the decentralized platform designed for creating,
        challenging, and winning wagers based on your prediction of the price of
        ETH/USD. We are thrilled to offer a unique and exciting way for you to
        test your market analysis skills and potentially earn (Sepolia) ETH in
        the process.
      </Text>
      <Text py={4}>
        Using WagerWinz is straightforward, even for those new to blockchain
        technology. Our platform is available exclusively on the Sepolia
        Testnet, a blockchain testing environment that provides a secure and
        user-friendly experience.
      </Text>
      <Text py={4}>
        At WagerWinz, we believe in providing a fair and transparent platform.
        All wagers are executed on-chain, and the results are determined based
        on the ETH/USD price feed. This ensures that all participants have
        access to the same information and that the outcome is entirely
        objective.
      </Text>
      <Text py={4}>
        Join our community of blockchain enthusiasts today and put your
        prediction skills to the test. Create a wager, challenge a friend, and
        win ETH on WagerWinz.
      </Text>
      <Text py={4}>
        <b>Disclaimer:</b> WagerWinz is a proof-of-concept application built on
        the Sepolia Testnet. The Sepolia Testnet is a blockchain testing
        environment that provides a secure and user-friendly experience. The
        Sepolia Testnet is not a production environment and is not intended for
        use with real money.
      </Text>
      <Text py={4}>
        <b>Important:</b> This About page content was created using AI
        generation (ChatGPT) as is a placeholder for the actual content. This
        website and the smart contracts are developed as a learning experience
        for an academic project. The project code are open-source and available
        on Github.
      </Text>
    </Container>
  );
}
