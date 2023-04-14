import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Box as="main" mt="60px">
        {children}
      </Box>
      <Footer />
    </>
  );
}
