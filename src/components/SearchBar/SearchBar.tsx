import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  names: string[];
}

export default function SearchBar({ onSearch, names }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredNames([]);
      setShowDropdown(false);
      onSearch("");
      return;
    }

    const filtered = names.filter((name) =>
      name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredNames(filtered);
    setShowDropdown(filtered.length > 0);
    onSearch(inputValue);
  }, [inputValue, names, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSelect(name: string) {
    setInputValue(name);
    setShowDropdown(false);
    onSearch(name);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        autoComplete="off"
        placeholder="Search breeds..."
        className="w-full p-2 mb-6 border border-gray-300 rounded"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => {
          if (filteredNames.length > 0) setShowDropdown(true);
        }}
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded shadow-md">
          {filteredNames.map((name) => (
            <li
              key={name}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-black"
              onClick={() => onSelect(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
