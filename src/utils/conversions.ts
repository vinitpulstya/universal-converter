import convert, { type Unit } from "convert-units";

export function convertUnit(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  try {
    return convert(value).from(fromUnit).to(toUnit);
  } catch (err) {
    console.error(err);
    return NaN;
  }
}
