
import React, { useState, useRef, useEffect } from 'react';

interface EditableDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const EditableDropdown: React.FC<EditableDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer bg-white border border-gray-300 px-2 py-1 flex justify-between items-center rounded-sm"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="text-gray-400 text-xs">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-sm overflow-hidden">
          <input
            type="text"
            className="w-full p-2 border-b border-gray-200 outline-none text-xs"
            placeholder="Search..."
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-height-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt}
                  className="px-2 py-1.5 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="px-2 py-1.5 text-gray-400 text-xs italic">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
