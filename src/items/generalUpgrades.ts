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
    id: "apa",
    name: "American Pale Ale",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 500000,
  },
  {
    id: "hefeweizen",
    name: "Hefeweizen",
    description: "Increase total output by 10%",
    multiplier: 1.1,
    price: 1000000,
  },
];
