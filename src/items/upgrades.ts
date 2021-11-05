export enum UpgradeStatus {
  Unavailable,
  Available,
  Active,
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  price: number;
  availabilityRequirement: number;
  status: UpgradeStatus;
}

export interface Upgrades {
  [assetId: string]: Upgrade[];
}

export const initialUpgrades: Upgrades = {
  homebrew: [
    {
      id: "biggerKettle",
      multiplier: 1.5,
      price: 250,
      name: "Bigger kettle",
      description: "Improves Homebrew Kit output by 50%",
      availabilityRequirement: 3,
      status: UpgradeStatus.Unavailable,
    },
    {
      id: "biggerFermenter",
      multiplier: 1.5,
      price: 5000,
      name: "Bigger fermenter",
      description: "",
      availabilityRequirement: 40,
      status: UpgradeStatus.Unavailable,
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
      status: UpgradeStatus.Unavailable,
    },
  ],
};
