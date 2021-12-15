import { allAssets } from "./assets";

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
      id: "homebrew-1",
      multiplier: 1.5,
      price: allAssets.homebrew.initialPrice * 10,
      name: "Bigger kettle",
      description: "Increase kettle size by 50%",
      availabilityRequirement: 5,
    },
    {
      id: "homebrew-2",
      multiplier: 2,
      price: allAssets.homebrew.initialPrice * 100,
      name: "Bigger fermentor",
      description: "Doubles the fermentor size",
      availabilityRequirement: 10,
    },
    {
      id: "homebrew-3",
      multiplier: 2,
      price: allAssets.homebrew.initialPrice * 1000,
      name: "Automatic temperature control",
      description: "Doubles the beer quality",
      availabilityRequirement: 25,
    },
    {
      id: "homebrew-4",
      multiplier: 2,
      price: allAssets.homebrew.initialPrice * 10000,
      name: "Better heater",
      description: "Precise heating doubles the beer quality",
      availabilityRequirement: 50,
    },
    {
      id: "homebrew-5",
      multiplier: 10,
      price: allAssets.homebrew.initialPrice * 100000,
      name: "Bottle filler",
      description: "Bottle beers 10 times faster with better filler",
      availabilityRequirement: 100,
    },
  ],
  brewsystem: [
    {
      id: "brewsystem-1",
      multiplier: 1.5,
      price: allAssets.brewsystem.initialPrice * 10,
      name: "Thermal sleeve",
      description: "50% faster heating",
      availabilityRequirement: 5,
    },
    {
      id: "brewsystem-2",
      multiplier: 2,
      price: allAssets.brewsystem.initialPrice * 100,
      name: "Wort cooler",
      description: "Cool the wort twice as fast",
      availabilityRequirement: 10,
    },
    {
      id: "brewsystem-3",
      multiplier: 2,
      price: allAssets.brewsystem.initialPrice * 1000,
      name: "Bigger machine",
      description: "Twice as big brewing system",
      availabilityRequirement: 25,
    },
    {
      id: "brewsystem-4",
      multiplier: 2,
      price: allAssets.brewsystem.initialPrice * 10000,
      name: "Kegging system",
      description: "Keg beer instead of bottling, twice as fast",
      availabilityRequirement: 50,
    },
    {
      id: "brewsystem-5",
      multiplier: 10,
      price: allAssets.brewsystem.initialPrice * 100000,
      name: "Pressure fermentor",
      description: "Big pressurized fermentor, increase output by 10",
      availabilityRequirement: 100,
    },
  ],
  employee: [
    {
      id: "employee-1",
      multiplier: 1.5,
      price: allAssets.employee.initialPrice * 10,
      name: "Courses",
      description: "Beer making courses for employees, 50% output increase",
      availabilityRequirement: 5,
    },
    {
      id: "employee-2",
      multiplier: 2,
      price: allAssets.employee.initialPrice * 100,
      name: "Brewmaster",
      description: "Hire a professional brewmaster to double the output",
      availabilityRequirement: 10,
    },
    {
      id: "employee-3",
      multiplier: 2,
      price: allAssets.employee.initialPrice * 1000,
      name: "Shifts",
      description: "Work around the clock, double the output",
      availabilityRequirement: 25,
    },
    {
      id: "employee-4",
      multiplier: 2,
      price: allAssets.employee.initialPrice * 10000,
      name: "Bonuses",
      description: "Double the output by giving bonuses for reaching target",
      availabilityRequirement: 50,
    },
    {
      id: "employee-5",
      multiplier: 10,
      price: allAssets.employee.initialPrice * 100000,
      name: "Robots",
      description: "Replace employees with robots, 10x increase in profits",
      availabilityRequirement: 100,
    },
  ],
  microbrewery: [
    {
      id: "microbrewery-1",
      multiplier: 1.5,
      price: allAssets.microbrewery.initialPrice * 10,
      name: "Bigger equipment",
      description: "Increase equipment size by 50%",
      availabilityRequirement: 5,
    },
    {
      id: "microbrewery-2",
      multiplier: 2,
      price: allAssets.microbrewery.initialPrice * 100,
      name: "Better rent",
      description: "Negotiate to cut the location rent by half",
      availabilityRequirement: 10,
    },
    {
      id: "microbrewery-3",
      multiplier: 2,
      price: allAssets.microbrewery.initialPrice * 1000,
      name: "Taproom",
      description: "Double the profits by selling beer straight from brewery",
      availabilityRequirement: 25,
    },
    {
      id: "microbrewery-4",
      multiplier: 2,
      price: allAssets.microbrewery.initialPrice * 10000,
      name: "Local stores",
      description: "Sell the beer in local stores, to double the profit",
      availabilityRequirement: 50,
    },
    {
      id: "microbrewery-5",
      multiplier: 10,
      price: allAssets.microbrewery.initialPrice * 100000,
      name: "Win competition",
      description:
        "Win a beer brewing competition, 10 times popularity increase",
      availabilityRequirement: 100,
    },
  ],
  pub: [
    {
      id: "pub-1",
      multiplier: 1.5,
      price: allAssets.pub.initialPrice * 10,
      name: "Professional bartender",
      description: "Sell 50% more beer",
      availabilityRequirement: 5,
    },
    {
      id: "pub-2",
      multiplier: 2,
      price: allAssets.pub.initialPrice * 100,
      name: "Salted peanuts",
      description: "Double the beer sales by giving free peanuts",
      availabilityRequirement: 10,
    },
    {
      id: "pub-3",
      multiplier: 2,
      price: allAssets.pub.initialPrice * 1000,
      name: "More taps",
      description: "Double the available beer taps",
      availabilityRequirement: 25,
    },
    {
      id: "pub-4",
      multiplier: 2,
      price: allAssets.pub.initialPrice * 10000,
      name: "Karaoke",
      description: "Sell twice more beer during Karaoke evenings",
      availabilityRequirement: 50,
    },
    {
      id: "pub-5",
      multiplier: 10,
      price: allAssets.pub.initialPrice * 100000,
      name: "Better location",
      description: "10 times more customers by moving to city center",
      availabilityRequirement: 100,
    },
  ],
  plant: [
    {
      id: "plant-1",
      multiplier: 1.5,
      price: allAssets.plant.initialPrice * 10,
      name: "Cheaper electricity",
      description: "Negotiate 50% cheaper electricity contract",
      availabilityRequirement: 5,
    },
    {
      id: "plant-2",
      multiplier: 2,
      price: allAssets.plant.initialPrice * 100,
      name: "Canning equipment",
      description: "Double the output by canning the beers",
      availabilityRequirement: 10,
    },
    {
      id: "plant-3",
      multiplier: 2,
      price: allAssets.plant.initialPrice * 1000,
      name: "Shifts",
      description: "Work around the clock, double the productivity",
      availabilityRequirement: 25,
    },
    {
      id: "plant-4",
      multiplier: 2,
      price: allAssets.plant.initialPrice * 100000,
      name: "Housing",
      description:
        "Build worker housing next to plant to double the profitability",
      availabilityRequirement: 50,
    },
    {
      id: "plant-5",
      multiplier: 10,
      price: allAssets.plant.initialPrice * 1000000,
      name: "Move factory",
      description: "Move factory to a country with 10 times cheaper workforce",
      availabilityRequirement: 100,
    },
  ],
  farm: [
    {
      id: "farm-1",
      multiplier: 1.5,
      price: allAssets.farm.initialPrice * 10,
      name: "Wider sowers",
      description: "Sow 50% more grain",
      availabilityRequirement: 5,
    },
    {
      id: "farm-2",
      multiplier: 2,
      price: allAssets.farm.initialPrice * 100,
      name: "Fertilizer",
      description: "Use twice as efficient fertilizer",
      availabilityRequirement: 10,
    },
    {
      id: "farm-3",
      multiplier: 2,
      price: allAssets.farm.initialPrice * 1000,
      name: "More hops",
      description: "Double the hop selection",
      availabilityRequirement: 25,
    },
    {
      id: "farm-4",
      multiplier: 2,
      price: allAssets.farm.initialPrice * 10000,
      name: "Automatic equipment",
      description: "Grow twice as much grain, using automatic farm machines",
      availabilityRequirement: 50,
    },
    {
      id: "farm-5",
      multiplier: 10,
      price: allAssets.farm.initialPrice * 100000,
      name: "Patents",
      description:
        "Patent the common varieties, increasing profits by 10 times",
      availabilityRequirement: 100,
    },
  ],
  sponsor: [
    {
      id: "sponsor-1",
      multiplier: 1.5,
      price: allAssets.sponsor.initialPrice * 10,
      name: "Darts",
      description: "Sponsor darts players, increase popularity by 50%",
      availabilityRequirement: 5,
    },
    {
      id: "sponsor-2",
      multiplier: 2,
      price: allAssets.sponsor.initialPrice * 100,
      name: "Golf",
      description: "Sponsor golf players, double the popularity",
      availabilityRequirement: 10,
    },
    {
      id: "sponsor-3",
      multiplier: 2,
      price: allAssets.sponsor.initialPrice * 1000,
      name: "Ice-Hockey",
      description: "Sponsor Ice-Hockey teams, double the popularity",
      availabilityRequirement: 25,
    },
    {
      id: "sponsor-4",
      multiplier: 2,
      price: allAssets.sponsor.initialPrice * 10000,
      name: "Cricket",
      description: "Sponsor cricket teams, double the popularity",
      availabilityRequirement: 50,
    },
    {
      id: "sponsor-5",
      multiplier: 10,
      price: allAssets.sponsor.initialPrice * 100000,
      name: "Football",
      description:
        "Head sponsor of a football team, 10 times popularity increase",
      availabilityRequirement: 100,
    },
  ],
  shipping: [
    {
      id: "shipping-1",
      multiplier: 1.5,
      price: allAssets.shipping.initialPrice * 10,
      name: "Neighbors",
      description: "Export beer to neighboring countries, 50% more profit",
      availabilityRequirement: 5,
    },
    {
      id: "shipping-2",
      multiplier: 2,
      price: allAssets.shipping.initialPrice * 100,
      name: "International",
      description: "Double the profits by shipping the beer around the world",
      availabilityRequirement: 10,
    },
    {
      id: "shipping-3",
      multiplier: 2,
      price: allAssets.shipping.initialPrice * 1000,
      name: "Own ships",
      description: "Buy a shipping company to double the profits",
      availabilityRequirement: 25,
    },
    {
      id: "shipping-4",
      multiplier: 2,
      price: allAssets.shipping.initialPrice * 10000,
      name: "Tax relief",
      description: "Double the profits by negotiating tax reliefs for shipping",
      availabilityRequirement: 50,
    },
    {
      id: "shipping-5",
      multiplier: 10,
      price: allAssets.shipping.initialPrice * 100000,
      name: "Brewer ships",
      description: "10 times increase to profits by brewing beer on ships",
      availabilityRequirement: 100,
    },
  ],
  buyout: [
    {
      id: "buyout-1",
      multiplier: 1.5,
      price: allAssets.buyout.initialPrice * 10,
      name: "Microbreweries",
      description: "Buy out local microbreweries, improve market share by 50%",
      availabilityRequirement: 5,
    },
    {
      id: "buyout-2",
      multiplier: 2,
      price: allAssets.buyout.initialPrice * 100,
      name: "Domestic breweries",
      description:
        "Buy out domestic larger breweries, double your market share",
      availabilityRequirement: 10,
    },
    {
      id: "buyout-3",
      multiplier: 2,
      price: allAssets.buyout.initialPrice * 1000,
      name: "International breweries",
      description:
        "Buy out international larger breweries, double your market share",
      availabilityRequirement: 25,
    },
    {
      id: "buyout-4",
      multiplier: 2,
      price: allAssets.buyout.initialPrice * 10000,
      name: "Biggest breweries",
      description:
        "Buy out the worlds biggest breweries, double your market share",
      availabilityRequirement: 50,
    },
    {
      id: "buyout-5",
      multiplier: 10,
      price: allAssets.buyout.initialPrice * 100000,
      name: "Monopoly",
      description:
        "Increase your profits by 10 times, by being the only brewery in the world",
      availabilityRequirement: 100,
    },
  ],
};
