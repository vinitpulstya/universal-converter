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
import Select from "../components/Select";
import { Button, Chip } from "@heroui/react";

type ToUnitState = {
  options: Unit[];
  value: Unit | null;
};

export default function Popup() {
  const [text, setText] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<Unit | null>(null);
  const [toUnitState, setToUnitState] = useState<ToUnitState>({
    options: [],
    value: null,
  });
  const [converted, setConverted] = useState<string>("");

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
    setToUnitState(({ value: prevValue }) => ({
      options: options,
      value: prevValue && options.includes(prevValue) ? prevValue : options[0],
    }));
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
    const toUnit = toUnitState.value;
    if (fromUnit && toUnit) {
      const { rawNumber } = splitNumberAndUnit(text);
      if (rawNumber) {
        const value = parseFloat(rawNumber);
        const result = convertUnit(value, fromUnit, toUnit);
        setConverted(`${result.toFixed(2)}`);
      } else {
        setConverted("No valid unit detected");
      }
    } else {
      alert(
        "No valid unit detected, make sure you have selected to and from units"
      );
    }
  };

  return (
    <div className="bg-gray-100 w-64 h-103 flex flex-col gap-2 p-4 pb-7 rounded-sm">
      <h1 className="text-xl font-bold text-center">Universal Converter</h1>
      <h3 className="mt-2 text-xs text-slate-600">From</h3>
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
      <div className="flex justify-between">
        <h3 className="mt-2 text-xs text-slate-600">To</h3>
        <Select
          value={toUnitState.value || toUnitState.options[0]}
          onChange={(e) =>
            setToUnitState((prevState) => ({
              ...prevState,
              value: e.target.value as Unit,
            }))
          }
          options={toUnitState.options.sort()}
        />
      </div>
      <Button variant="shadow" color="primary" onPress={handleConvert}>
        Convert
      </Button>
      <h2 className="text-lg text-slate-700">
        {converted}
        {converted && toUnitState.value && (
          <Chip variant="flat" className="ml-1">
            {toUnitState.value}
          </Chip>
        )}
      </h2>
    </div>
  );
}
