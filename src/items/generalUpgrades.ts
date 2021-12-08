export interface GeneralUpgradeData {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  price: number;
}

export interface GeneralUpgrade {
  id: string;
  active: boolean;
}

export const allGeneralUpgrades: GeneralUpgradeData[] = [
  {
    id: "pilsner",
    name: "Pilsner",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 1000,
  },
  {
    id: "ipa",
    name: "India Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 2000,
  },
  {
    id: "apa",
    name: "American Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 3000,
  },
  {
    id: "hefeweizen",
    name: "Hefeweizen",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 2000000,
  },
  {
    id: "stout",
    name: "Stout",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 3000000,
  },
  {
    id: "amberale",
    name: "Amber Ale",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 4000000,
  },
  {
    id: "dunkel",
    name: "Dunkel",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 5000000,
  },
  {
    id: "helles",
    name: "Helles",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 5000000,
  },
  {
    id: "tripel",
    name: "Tripel",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 6000000,
  },
  {
    id: "dubbel",
    name: "Dubbel",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 7000000,
  },
  {
    id: "lambic",
    name: "Lambic",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 8000000,
  },
  {
    id: "witbier",
    name: "Witbier",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 9000000,
  },
  {
    id: "sour",
    name: "Sour",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 10000000,
  },
  {
    id: "neipa",
    name: "New England Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 11000000,
  },
  {
    id: "porter",
    name: "Porter",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 12000000,
  },
  {
    id: "berlinerweisse",
    name: "Berliner Weisse",
    description: "Increase total output by 10%",
    multiplier: 1.2,
    price: 13000000,
  },
];
