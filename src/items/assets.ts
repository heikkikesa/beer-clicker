import homeBrewImage from "../images/cooking.svg";
import brewSystemImage from "../images/brewing.svg";
import employeeImage from "../images/brewer.svg";
import microBreweryImage from "../images/brewery.svg";
import plantImage from "../images/factory.svg";
import farmingImage from "../images/farm-house.svg";
import pubImage from "../images/pub.svg";
import sportsImage from "../images/sports-team.svg";
import shippingImage from "../images/cargo-ship.svg";
import buyoutImage from "../images/buyout.svg";

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
    initialPrice: 150,
    image: brewSystemImage,
  },
  employee: {
    id: "employee",
    name: "Employee",
    description: "Brews beer for you",
    bpcCoefficient: 6,
    bpsCoefficient: 2,
    initialPrice: 900,
    image: employeeImage,
  },
  microbrewery: {
    id: "microbrewery",
    name: "Microbrewery",
    description: "Brew larger amounts of beer",
    bpcCoefficient: 8,
    bpsCoefficient: 8,
    initialPrice: 5500,
    image: microBreweryImage,
  },
  pub: {
    id: "pub",
    name: "Pub",
    description: "Serve your beer in a pub",
    bpcCoefficient: 10,
    bpsCoefficient: 32,
    initialPrice: 35000,
    image: pubImage,
  },
  plant: {
    id: "plant",
    name: "Brewing plant",
    description: "Get your beer to supermarkets",
    bpcCoefficient: 15,
    bpsCoefficient: 128,
    initialPrice: 240000,
    image: plantImage,
  },
  farm: {
    id: "farm",
    name: "Farm",
    description: "Grow your own grain and hops",
    bpcCoefficient: 22,
    bpsCoefficient: 512,
    initialPrice: 1450000,
    image: farmingImage,
  },
  sponsor: {
    id: "sponsor",
    name: "Sponsorship",
    description: "Be a head sponsor of a sports team",
    bpcCoefficient: 33,
    bpsCoefficient: 2048,
    initialPrice: 8500000,
    image: sportsImage,
  },
  shipping: {
    id: "shipping",
    name: "Shipping",
    description: "Make your beer available worldwide",
    bpcCoefficient: 50,
    bpsCoefficient: 8192,
    initialPrice: 52000000,
    image: shippingImage,
  },
  buyout: {
    id: "buyout",
    name: "Buyout",
    description: "Buy out your competitor",
    bpcCoefficient: 75,
    bpsCoefficient: 32780,
    initialPrice: 325000000,
    image: buyoutImage,
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
