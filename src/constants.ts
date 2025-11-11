const UnitSystem = {
  METRIC: "metric",
  IMPERIAL: "imperial",
} as const;

export type UnitSystem = (typeof UnitSystem)[keyof typeof UnitSystem];

const UnitTypes = {
    LENGTH: "length",
    MASS: "mass",
    ELECTRIC_CURRENT: "electric_current",
    TEMPERATURE: "temperature",
    AMOUNT_OF_SUBSTANCE: "amount_of_substance",
    LUMINOUS_INTENSITY: "luminous_intensity",
} as const;

export type UnitTypes = (typeof UnitTypes)[keyof typeof UnitTypes];