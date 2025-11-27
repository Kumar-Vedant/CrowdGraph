import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Node {
  id: string;
  label: string;
  group?: string;
  [key: string]: any;
}

interface NodeSearchDropdownProps {
  nodes: Node[];
  value: string;
  onChange: (nodeId: string) => void;
  placeholder?: string;
}

const NodeSearchDropdown: React.FC<NodeSearchDropdownProps> = ({
  nodes,
  value,
  onChange,
  placeholder = "Search nodes...",
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<Node[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected node label
  const selectedNode = nodes.find((n) => n.id === value);
  const displayLabel = selectedNode?.label || "";

  // Filter nodes based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredResults(nodes || []);
      setHighlightedIndex(-1);
      return;
    }

    const results = (nodes || []).filter((node) => {
      if (!node) return false;
      const label = (node.label || "").toString().toLowerCase();
      const id = (node.id || "").toString().toLowerCase();
      return label.includes(query) || id.includes(query);
    });
    setFilteredResults(results);
    setHighlightedIndex(-1);
  }, [searchQuery, nodes]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelectNode(filteredResults[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, highlightedIndex, filteredResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as HTMLElement)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectNode = (node: Node) => {
    onChange(node.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Main Input */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchQuery : displayLabel}
          onChange={handleInputChange}
          onFocus={() => {
            handleInputFocus();
          }}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "0.875rem",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "8px",
            background: theme.colors.background,
            color: theme.colors.text,
            outline: "none",
            transition: "border-color 0.2s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = theme.colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = theme.colors.border;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        />

        {/* Clear button when value is selected */}
        {value && !isOpen && (
          <button
            onClick={() => {
              onChange("");
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            style={{
              position: "absolute",
              right: "8px",
              background: "none",
              border: "none",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.textSecondary;
            }}
            title="Clear selection"
          >
            ✕
          </button>
        )}

        {/* Dropdown indicator */}
        {!isOpen && (
          <div
            style={{
              position: "absolute",
              right: value ? "28px" : "8px",
              color: theme.colors.textSecondary,
              pointerEvents: "none",
              transition: "right 0.2s ease",
            }}
          >
            ▼
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            background: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "8px",
            maxHeight: "240px",
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((node, index) => (
              <button
                key={node.id}
                onClick={() => handleSelectNode(node)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  textAlign: "left",
                  border: "none",
                  background:
                    highlightedIndex === index
                      ? `${theme.colors.primary}15`
                      : value === node.id
                      ? `${theme.colors.primary}08`
                      : theme.colors.cardBg,
                  color: theme.colors.text,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.15s ease",
                  borderBottom:
                    index < filteredResults.length - 1
                      ? `1px solid ${theme.colors.border}40`
                      : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: theme.colors.primary,
                      fontWeight: "600",
                      fontSize: "0.75rem",
                    }}
                  >
                    ●
                  </span>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                      style={{
                        fontWeight: "500",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                  {value === node.id && (
                    <span
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div
              style={{
                padding: "12px",
                textAlign: "center",
                color: theme.colors.textSecondary,
                fontSize: "0.875rem",
              }}
            >
              No nodes found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NodeSearchDropdown;
