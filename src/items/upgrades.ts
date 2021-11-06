export enum UpgradeStatus {
  Unavailable,
  Available,
  Active,
}

export interface UpgradeData {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  price: number;
  availabilityRequirement: number;
}

export type UpgradeDatas = {
  [assetId: string]: UpgradeData[];
};

export interface Upgrade {
  id: string;
  status: UpgradeStatus;
}

export type Upgrades = {
  [assetId: string]: Upgrade[];
};

export const allUpgrades: UpgradeDatas = {
  homebrew: [
    {
      id: "biggerKettle",
      multiplier: 1.5,
      price: 250,
      name: "Bigger kettle",
      description: "Improves Homebrew Kit output by 50%",
      availabilityRequirement: 3,
    },
    {
      id: "biggerFermenter",
      multiplier: 1.5,
      price: 5000,
      name: "Bigger fermenter",
      description: "",
      availabilityRequirement: 40,
    },
  ],
  brewsystem: [
    {
      id: "whirlpoolArm",
      multiplier: 1.5,
      price: 20000,
      name: "Whirlpool arm",
      description: "",
      availabilityRequirement: 10,
    },
  ],
  employee: [
    {
      id: "education",
      multiplier: 1.5,
      price: 50000,
      name: "Educate employees",
      description: "",
      availabilityRequirement: 10,
    },
  ],
  microbrewery: [
    {
      id: "equipment",
      multiplier: 1.5,
      price: 200000,
      name: "Better equipment",
      description: "",
      availabilityRequirement: 10,
    },
  ],
  plant: [
    {
      id: "cheaperPower",
      multiplier: 1.5,
      price: 500000,
      name: "Cheaper power contract",
      description: "",
      availabilityRequirement: 10,
    },
  ],
  farm: [
    {
      id: "widerSower",
      multiplier: 1.5,
      price: 2000000,
      name: "Wider sowers",
      description: "",
      availabilityRequirement: 10,
    },
  ],
};
