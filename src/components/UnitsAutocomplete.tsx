import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/react";
import { UnitGroups } from "../utils/units";
import { useState, type Key } from "react";

type UnitsAutocompleteProps = {
  value: string;
  onChange: (unit: Key | null) => void;
};

export default function UnitsAutocomplete({
  value,
  onChange,
}: UnitsAutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(value);

  const handleSelectionChange = (unit: Key | null) => {
    setInputValue(unit ? (unit as string) : "");
    onChange(unit);
  };

  return (
    <Autocomplete
      className="max-w-25"
      variant="underlined"
      aria-label="Select from unit"
      isClearable={false}
      inputValue={inputValue}
      selectedKey={value}
      onInputChange={setInputValue}
      onSelectionChange={handleSelectionChange}
      defaultItems={Object.entries(UnitGroups)}
    >
      {(item) => {
        const [group, unitsUnsorted] = item;
        const units = [...unitsUnsorted].sort();
        return (
          <AutocompleteSection key={group} title={group}>
            {units.map((unit) => (
              <AutocompleteItem key={unit}>{unit}</AutocompleteItem>
            ))}
          </AutocompleteSection>
        );
      }}
    </Autocomplete>
  );
}
