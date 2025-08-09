interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search breeds..."
      className="w-full p-2 mb-6 border border-gray-300 rounded"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
