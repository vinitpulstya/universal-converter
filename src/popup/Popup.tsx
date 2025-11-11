import { useEffect, useState } from "react";
import { convertUnit } from "../utils/conversions";
import {
  extractUnit,
  splitNumberAndUnit,
  Units,
  type Unit,
} from "../utils/units";
import convert from "convert-units";
import Select from "../components/Select";

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
    setFromUnit(detectedUnit ? detectedUnit : Units[0]);
    setText(text);
    handleToUnits(detectedUnit);
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
        setConverted(`${result.toFixed(2)} ${toUnit}`);
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
    <div className="bg-gray-100 w-64 flex flex-col gap-2 p-4 pb-7 rounded-sm">
      <h1 className="text-xl font-bold text-center">Universal Converter</h1>
      <h3 className="mt-2 text-xs text-slate-600">Convert from</h3>
      <div className="flex justify-between">
        <input
          className="text-sm w-30 p-1 border-1 rounded-md"
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        <Select
          value={fromUnit || Units[0]}
          onChange={(e) => {
            const fromUnit = e.target.value as Unit;
            setFromUnit(fromUnit);
            handleToUnits(fromUnit);
          }}
          options={Units}
        />
      </div>
      <div className="flex justify-between">
        <h3 className="mt-2 text-xs text-slate-600">Convert to unit</h3>
        <Select
          value={toUnitState.value || toUnitState.options[0]}
          onChange={(e) =>
            setToUnitState((prevState) => ({
              ...prevState,
              value: e.target.value as Unit,
            }))
          }
          options={toUnitState.options}
        />
      </div>
      <button
        className="bg-blue-500 py-1 px-2 rounded hover:cursor-pointer"
        onClick={handleConvert}
      >
        Convert
      </button>
      <h2 className="text-lg">{converted}</h2>
    </div>
  );
}
