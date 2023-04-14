interface NavItem {
  label: string;
  link: string;
}

export const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Create a challenge",
    link: "/create-challenge",
  },
  {
    label: "Browse",
    link: "/browse-challenges",
  },
  {
    label: "How it works",
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
    link: "#",
  },
  {
    label: "Etherscan",
    link: "#",
  },
];

export type { NavItem };
