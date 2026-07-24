import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  key: string;
  title: string;
  options: FilterOption[];
  collapsible?: boolean;
}

interface SidebarProps {
  groups: FilterGroup[];
  selected: Record<string, string[]>;
  onChange: (groupKey: string, value: string, checked: boolean) => void;
}

const FilterGroupSection = ({
  group,
  selectedValues,
  onChange,
}: {
  group: FilterGroup;
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleOptions =
    group.collapsible && !expanded ? group.options.slice(0, 6) : group.options;

  return (
    <div className="py-4 border-b border-gray-100">
      <h4 className="font-semibold text-gray-800 text-sm mb-3">{group.title}</h4>
      <div className="space-y-2">
        {visibleOptions.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={(e) => onChange(opt.value, e.target.checked)}
              className="accent-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {group.collapsible && group.options.length > 6 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-xs font-medium mt-2"
        >
          {expanded ? "VIEW LESS" : "VIEW MORE"}
        </button>
      )}
    </div>
  );
};

const Sidebar = ({ groups, selected, onChange }: SidebarProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 sticky top-4 w-64 shrink-0">
      {groups.map((group) => (
        <FilterGroupSection
          key={group.key}
          group={group}
          selectedValues={selected[group.key] || []}
          onChange={(value, checked) => onChange(group.key, value, checked)}
        />
      ))}
    </div>
  );
};

export default Sidebar;