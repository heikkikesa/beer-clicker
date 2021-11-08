import homeBrewImage from "../images/cooking.svg";
import brewSystemImage from "../images/brewing.svg";
import employeeImage from "../images/brewer.svg";
import microBreweryImage from "../images/brewery.svg";
import plantImage from "../images/factory.svg";
import farmingImage from "../images/farm-house.svg";

export enum AssetStatus {
  Unavailable,
  Available,
  Purchased,
}

export interface AssetData {
  id: string;
  name: string;
  description: string;
  bpcCoefficient: number;
  bpsCoefficient: number;
  initialPrice: number;
  image: string;
}

export type AssetDatas = {
  [index: string]: AssetData;
};

export interface Asset {
  id: string;
  amount: number;
  price: number;
  bps: number;
  bpc: number;
  status: AssetStatus;
}

export type Assets = {
  [index: string]: Asset;
};

export const allAssets: AssetDatas = {
  homebrew: {
    id: "homebrew",
    name: "Homebrew kit",
    description: "Basic homebrewing supplies",
    bpcCoefficient: 1,
    bpsCoefficient: 0.1,
    initialPrice: 25,
    image: homeBrewImage,
  },
  brewsystem: {
    id: "brewsystem",
    name: "All-In-One brewing system",
    description: "Electronically controlled kettle",
    bpcCoefficient: 5,
    bpsCoefficient: 0.5,
    initialPrice: 450,
    image: brewSystemImage,
  },
  employee: {
    id: "employee",
    name: "Employee",
    description: "Brews beer",
    bpcCoefficient: 6,
    bpsCoefficient: 1,
    initialPrice: 2500,
    image: employeeImage,
  },
  microbrewery: {
    id: "microbrewery",
    name: "Microbrewery",
    description: "Brew larger amounts of beer",
    bpcCoefficient: 8,
    bpsCoefficient: 4,
    initialPrice: 20000,
    image: microBreweryImage,
  },
  plant: {
    id: "plant",
    name: "Brewing plant",
    description: "Get your beer to supermarkets",
    bpcCoefficient: 15,
    bpsCoefficient: 25,
    initialPrice: 245000,
    image: plantImage,
  },
  farm: {
    id: "farm",
    name: "Farm",
    description: "Grow your own grain and hops",
    bpcCoefficient: 20,
    bpsCoefficient: 48,
    initialPrice: 750000,
    image: farmingImage,
  },
};

export const initialAssets: Assets = {
  homebrew: {
    id: allAssets.homebrew.id,
    amount: 0,
    price: allAssets.homebrew.initialPrice,
    bpc: 0,
    bps: 0,
    status: AssetStatus.Available,
  },
};
