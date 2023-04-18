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
    link: "#",
  },
  {
    label: "Etherscan",
    link: "#",
  },
];

export type { NavItem };
