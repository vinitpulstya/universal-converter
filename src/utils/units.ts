// ===========================
//  SINGLE SOURCE OF TRUTH
// ===========================
export const UnitGroups = {
  Distance: ["mm", "cm", "m", "km", "in", "ft-us", "ft", "yd", "mi"],
  Mass: ["mcg", "mg", "g", "kg", "oz", "lb", "mt", "t"],
  Temperature: ["C", "F", "K", "R"],
  Time: ["ns", "mu", "ms", "s", "min", "h", "d", "week", "month", "year"],
  Energy: ["Wh", "mWh", "kWh", "MWh", "GWh", "J", "kJ"],
  Power: ["W", "mW", "kW", "MW", "GW"],
  Pressure: ["Pa", "hPa", "kPa", "MPa", "bar", "torr", "psi", "ksi"],
  Volume: ["ml", "l", "m3", "gal", "qt", "pnt", "cup"],
  Speed: ["m/s", "km/h", "ft/s", "m/h", "knot"],
  // ... add others if needed
} as const;

export type UnitGroup = keyof typeof UnitGroups;
export type Unit = (typeof UnitGroups)[keyof typeof UnitGroups][number];
export const Units = Object.values(UnitGroups).flat() as Unit[];

// ===========================
//  ALIAS MAP (EXTENDED)
// ===========================
const unitAliases: Record<string, Unit> = {
  // --- MASS ---
  gram: "g",
  grams: "g",
  gm: "g",
  kilogram: "kg",
  kilograms: "kg",
  kilo: "kg",
  kilos: "kg",
  milligram: "mg",
  milligrams: "mg",
  tonne: "t",
  ton: "t",
  tons: "t",
  ounce: "oz",
  ounces: "oz",
  pound: "lb",
  pounds: "lb",

  // --- DISTANCE ---
  meter: "m",
  meters: "m",
  metre: "m",
  metres: "m",
  mtr: "m",
  kilometer: "km",
  kilometers: "km",
  kilometre: "km",
  kilometres: "km",
  centimeter: "cm",
  centimeters: "cm",
  cms: "cm",
  millimeter: "mm",
  millimeters: "mm",
  inch: "in",
  inches: "in",
  foot: "ft",
  feet: "ft",
  yard: "yd",
  yards: "yd",
  mile: "mi",
  miles: "mi",

  // --- TEMPERATURE ---
  celsius: "C",
  "°c": "C",
  centigrade: "C",
  fahrenheit: "F",
  kelvin: "K",

  // --- TIME ---
  second: "s",
  seconds: "s",
  minute: "min",
  minutes: "min",
  hour: "h",
  hours: "h",
  day: "d",
  days: "d",
  week: "week",
  weeks: "week",
  month: "month",
  months: "month",
  year: "year",
  years: "year",

  // --- ENERGY (added compound aliases) ---
  joule: "J",
  joules: "J",
  kilojoule: "kJ",
  kilojoules: "kJ",
  watthour: "Wh",
  "watt hour": "Wh",
  "watt-hour": "Wh",
  watthours: "Wh",
  "watt hours": "Wh",
  "watt-hours": "Wh",
  kilowatthour: "kWh",
  "kilowatt hour": "kWh",
  "kilowatt-hour": "kWh",
  kilowatthours: "kWh",
  "kilowatt hours": "kWh",
  "kilowatt-hours": "kWh",
  megawatthour: "MWh",
  "megawatt hour": "MWh",
  "megawatt-hour": "MWh",
  gigawatthour: "GWh",
  "gigawatt hour": "GWh",
  "gigawatt-hour": "GWh",

  // --- POWER ---
  watt: "W",
  watts: "W",
  kilowatt: "kW",
  kilowatts: "kW",
  megawatt: "MW",
  megawatts: "MW",
  gigawatt: "GW",
  gigawatts: "GW",
  milliwatt: "mW",
  milliwatts: "mW",

  // --- PRESSURE ---
  pascal: "Pa",
  pascals: "Pa",
  bar: "bar",
  bars: "bar",
  psi: "psi",
  torr: "torr",
  kilopascal: "kPa",
  kilopascals: "kPa",

  // --- VOLUME ---
  liter: "l",
  liters: "l",
  litre: "l",
  litres: "l",
  milliliter: "ml",
  milliliters: "ml",
  millilitre: "ml",
  millilitres: "ml",
  cubicmeter: "m3",
  cubicmeters: "m3",
  gallon: "gal",
  gallons: "gal",
  quart: "qt",
  quarts: "qt",
  pint: "pnt",
  pints: "pnt",
  cup: "cup",
  cups: "cup",

  // --- SPEED ---
  "meter per second": "m/s",
  "meters per second": "m/s",
  "kilometer per hour": "km/h",
  "kilometers per hour": "km/h",
  "mph": "m/h",
  "miles per hour": "m/h",
  "knot": "knot",
  "knots": "knot",
};

// ===========================
//  HELPERS
// ===========================
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// export function splitNumberAndUnit(input: string): {
//   rawNumber: string | null;
//   unitPart: string;
// } {
//   // const regex = /^\s*([+-]?\d{1,3}(?:,\d{3})*(?:\.\d+)?|[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?|\.\d+)(.*)$/i;
//   const regex = /^\s*(\d{1,3}(,\d{3})*|\d+)(\.\d+)?\s*(.*)$/i;
//   const m = input.match(regex);
//   if (!m) return { rawNumber: null, unitPart: input.trim() };
//   return { rawNumber: m[1].trim(), unitPart: (m[2] || "").trim() };
// }

export function splitNumberAndUnit(input: string): {
  rawNumber: string | null;
  unitPart: string;
} {
  // Simplified regex that handles both numbers with and without commas
  const regex = /^\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(.+)?$/;
  const m = input.toLowerCase().match(regex);

  if (!m) return { rawNumber: null, unitPart: input.trim() };

  return {
    rawNumber: m[1].replace(/,/g, ''),
    unitPart: (m[2] || '').trim()
  };
}

// ===========================
//  NORMALIZE SYMBOLS (case-insensitive, like "kwh" → "kWh")
// ===========================
function normalizeSymbolCase(symbol: string): Unit | null {
  const lower = symbol.toLowerCase();
  const canonical = Units.find((u) => u.toLowerCase() === lower);
  return canonical ?? null;
}

// ===========================
//  MATCH UNIT
// ===========================
function findUnitFromUnitPart(unitPart: string): Unit | null {
  if (!unitPart) return null;
  const up = unitPart.trim().toLowerCase();

  // 1) Try canonical symbol match (case-insensitive)
  for (const unit of Units.sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`^${escapeRegex(unit.toLowerCase())}(\\b|$)`, "i");
    if (re.test(up)) return unit;
  }

  // 2) Try alias match (includes "watt hour", "kilowatt-hour")
  for (const [alias, canonical] of Object.entries(unitAliases).sort(
    ([a], [b]) => b.length - a.length
  )) {
    const re = new RegExp(`^${escapeRegex(alias)}(s?)(\\b|$)`, "i");
    if (re.test(up)) return canonical;
  }

  // 3) Try normalized symbol (kwh → kWh)
  const normalized = normalizeSymbolCase(up);
  if (normalized) return normalized;

  return null;
}

// ===========================
//  PUBLIC FUNCTIONS
// ===========================
export function extractUnit(input: string): Unit | null {
  const { unitPart } = splitNumberAndUnit(input);
  return findUnitFromUnitPart(unitPart);
}

export function getUnitGroup(unit: Unit): UnitGroup | null {
  for (const [group, list] of Object.entries(UnitGroups) as [
    UnitGroup,
    readonly Unit[]
  ][]) {
    if (list.includes(unit)) return group;
  }
  return null;
}

export function parseValueAndUnit(input: string): {
  value: number;
  unit: Unit;
  type: UnitGroup;
} | null {
  const { rawNumber, unitPart } = splitNumberAndUnit(input);
  const unit = findUnitFromUnitPart(unitPart);
  if (!unit) return null;
  if (!rawNumber) return null;
  const value = Number(rawNumber.replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  const type = getUnitGroup(unit);
  if (!type) return null;
  return { value, unit, type };
}

// ===========================
//  TESTS (remove in prod)
// ===========================
// if (require && (require as any).main === module) {
//   const tests = [
//     "5kwh",
//     "5 KWH",
//     "5 kilowatt-hour",
//     "10 watt hours",
//     "12Wh",
//     "1,000.5 joules",
//     "250 grams",
//     "2 kilometers",
//     "60min",
//     "20 psi",
//     "3 kpa",
//   ];
//   for (const t of tests) console.log(t, "→", parseValueAndUnit(t));
// }
