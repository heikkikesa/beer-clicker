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

export interface Asset {
  id: string;
  name: string;
  bpc: number;
  bps: number;
  amount: number;
  price: number;
  image: string;
  status: AssetStatus;
}

export interface Assets {
  [index: string]: Asset;
}

export const initialAssets: Assets = {
  homebrew: {
    id: "homebrew",
    name: "Homebrew kit",
    bpc: 1,
    bps: 0.1,
    amount: 0,
    price: 25,
    image: homeBrewImage,
    status: AssetStatus.Available,
  },
  brewsystem: {
    id: "brewsystem",
    name: "All-In-One brewing system",
    bpc: 5,
    bps: 0.5,
    amount: 0,
    price: 450,
    image: brewSystemImage,
    status: AssetStatus.Unavailable,
  },
  employee: {
    id: "employee",
    name: "Employee",
    bpc: 6,
    bps: 1,
    amount: 0,
    price: 2500,
    image: employeeImage,
    status: AssetStatus.Unavailable,
  },
  microbrewery: {
    id: "microbrewery",
    name: "Microbrewery",
    bpc: 20,
    bps: 4,
    amount: 0,
    price: 20000,
    image: microBreweryImage,
    status: AssetStatus.Unavailable,
  },
  plant: {
    id: "plant",
    name: "Brewing plant",
    bpc: 80,
    bps: 25,
    amount: 0,
    price: 245000,
    image: plantImage,
    status: AssetStatus.Unavailable,
  },
  farm: {
    id: "farm",
    name: "Farm",
    bpc: 240,
    bps: 48,
    amount: 0,
    price: 750000,
    image: farmingImage,
    status: AssetStatus.Unavailable,
  },
};
