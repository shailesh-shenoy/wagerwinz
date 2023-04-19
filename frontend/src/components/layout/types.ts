import { CHALLENGE_FACTORY_ADDRESS } from "@/artifacts/contracts/challengeFactoryAddress";

interface NavItem {
  label: string;
  link: string;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "CREATE",
    link: "/create-challenge",
  },
  {
    label: "VIEW",
    link: "/view-challenge",
  },
  {
    label: "HOW IT WORKS",
    link: "/how-it-works",
  },
];

export const ABOUT_ITEMS: Array<NavItem> = [
  {
    label: "About",
    link: "/about",
  },
  {
    label: "Github",
    link: "https://github.com/shailesh-shenoy/wagerwinz",
  },
  {
    label: "Etherscan",
    link: `https://sepolia.etherscan.io/address/${CHALLENGE_FACTORY_ADDRESS}`,
  },
];

export type { NavItem };
