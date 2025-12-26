import { useEffect, useState } from "react";
import { convertUnit } from "../utils/conversions";
import {
  extractUnit,
  splitNumberAndUnit,
  Units,
  type Unit,
} from "../utils/units";
import convert from "convert-units";
import { Input } from "@heroui/input";
import UnitsAutocomplete from "../components/UnitsAutocomplete";
import { Alert, Button, Card, CardHeader } from "@heroui/react";

type Converted = { converted: string; unit: Unit };

export default function Popup() {
  const [text, setText] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<Unit | null>(null);
  const [toUnitOptions, setToUnitOptions] = useState<Unit[]>([]);
  const [converted, setConverted] = useState<Converted[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleTextChange = (text: string) => {
    const detectedUnit = extractUnit(text);
    const fallbackUnit = fromUnit ? fromUnit : Units[0];
    setFromUnit(detectedUnit ? detectedUnit : fallbackUnit);
    setText(text);
    handleToUnits(detectedUnit || fallbackUnit);
  };

  const handleToUnits = (fromUnit: Unit | null) => {
    const options = fromUnit
      ? (convert().from(fromUnit).possibilities() as Unit[])
      : Units;
    setToUnitOptions(options);
  };

  useEffect(() => {
    chrome.storage?.local.get("selectedText", ({ selectedText }) => {
      if (selectedText) handleTextChange(selectedText);
    });
    // Listen for live updates
    chrome.runtime?.onMessage.addListener((msg) => {
      if (msg.type === "selection") handleTextChange(msg.text);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConvert = () => {
    if (fromUnit && toUnitOptions) {
      const { rawNumber } = splitNumberAndUnit(text);
      if (rawNumber) {
        const value = parseFloat(rawNumber);
        const newConverted: Converted[] = [];
        toUnitOptions.forEach((toUnit) => {
          const result = convertUnit(value, fromUnit, toUnit);
          newConverted.push({ converted: result.toFixed(2), unit: toUnit });
        });
        setConverted(newConverted);
        setErrors([]);
      } else {
        setErrors(["No valid number or unit detected."]);
      }
    } else {
      setErrors(["No valid number or unit detected."]);
    }
  };

  return (
    <div className="w-64 h-103 flex flex-col gap-2 p-4 pb-7">
      <h1 className="text-xl font-bold text-center font-mono">
        Universal Converter
      </h1>
      <h3 className="mt-2 text-xs text-slate-400">From</h3>
      <div className="flex justify-between gap-1">
        <Input
          type="text"
          variant="underlined"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        <UnitsAutocomplete
          value={fromUnit || Units[0]}
          onChange={(unit) => {
            const fromUnit = unit as Unit;
            setFromUnit(fromUnit);
            handleToUnits(fromUnit);
          }}
        />
      </div>
      <Button size="md" color="primary" variant="flat" onPress={handleConvert}>
        Convert
      </Button>
      <div className="text-xs text-slate-700 h-auto overflow-auto">
        {converted?.map(({ converted, unit }) => (
          <Card radius="none">
            <CardHeader className="flex justify-between">
              <p className="text-tiny uppercase font-medium">{converted}</p>
              <small className="text-default-500">{unit}</small>
            </CardHeader>
          </Card>
        ))}
      </div>
      {errors.length > 0 && (
        <Alert color="danger" title={errors.map((err) => err)} />
      )}
    </div>
  );
}
