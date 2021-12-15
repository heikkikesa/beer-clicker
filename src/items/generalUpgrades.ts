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
    multiplier: 1.1,
    price: 100000,
  },
  {
    id: "ipa",
    name: "India Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 250000,
  },
  {
    id: "hefeweizen",
    name: "Hefeweizen",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 500000,
  },
  {
    id: "apa",
    name: "American Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 1250000,
  },
  {
    id: "stout",
    name: "Stout",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 3120000,
  },
  {
    id: "amberale",
    name: "Amber Ale",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 7800000,
  },
  {
    id: "dunkel",
    name: "Dunkel",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 19500000,
  },
  {
    id: "helles",
    name: "Helles",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 48000000,
  },
  {
    id: "dubbel",
    name: "Dubbel",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 120000000,
  },
  {
    id: "tripel",
    name: "Tripel",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 300000000,
  },
  {
    id: "lambic",
    name: "Lambic",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 750000000,
  },
  {
    id: "witbier",
    name: "Witbier",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 1800000000,
  },
  {
    id: "sour",
    name: "Sour",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 4500000000,
  },
  {
    id: "porter",
    name: "Porter",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 11250000000,
  },
  {
    id: "berlinerweisse",
    name: "Berliner Weisse",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 28000000000,
  },
  {
    id: "gose",
    name: "Gose",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 70000000000,
  },
  {
    id: "bitter",
    name: "Bitter",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 175000000000,
  },
  {
    id: "barleywine",
    name: "Barley Wine",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 438000000000,
  },
  {
    id: "neipa",
    name: "New England Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 1000000000000,
  },
];
