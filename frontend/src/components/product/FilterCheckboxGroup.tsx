import { useState } from "react";

interface FilterCheckboxGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
  initialVisible?: number;
}

const FilterCheckboxGroup = ({
  title,
  options,
  selected,
  onChange,
  initialVisible = 6,
}: FilterCheckboxGroupProps) => {
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) return null;

  const visibleOptions = expanded ? options : options.slice(0, initialVisible);
  const hasMore = options.length > initialVisible;

  return (
    <div className="border-t pt-4">
      <h3 className="font-bold mb-3 text-sm">{title}</h3>
      <div className="space-y-2">
        {visibleOptions.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm cursor-pointer text-gray-600"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={(e) => onChange(opt, e.target.checked)}
              className="accent-primary"
            />
            {opt}
          </label>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-primary text-xs font-semibold mt-2"
        >
          {expanded ? "VIEW LESS" : "VIEW MORE"}
        </button>
      )}
    </div>
  );
};

export default FilterCheckboxGroup;