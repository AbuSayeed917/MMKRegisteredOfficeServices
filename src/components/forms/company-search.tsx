"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building2,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import type {
  CompanySearchItem,
  CompanyProfileResponse,
} from "@/types/companies-house";

interface CompanySearchProps {
  onCompanySelect: (profile: CompanyProfileResponse) => void;
  onClear?: () => void;
  selectedCompany?: { name: string; number: string } | null;
}

export function CompanySearch({
  onCompanySelect,
  onClear,
  selectedCompany,
}: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanySearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const searchCompanies = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/companies-house/search?q=${encodeURIComponent(searchQuery)}&limit=8`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Search failed");
      }

      const data = await response.json();
      setResults(data.items || []);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle input change with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchCompanies(query);
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchCompanies]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelectCompany(results[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Select a company and fetch full profile
  const handleSelectCompany = async (company: CompanySearchItem) => {
    setShowDropdown(false);
    setQuery(company.company_name);
    setIsLoadingProfile(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/companies-house/profile?number=${encodeURIComponent(company.company_number)}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load company details");
      }

      const profile: CompanyProfileResponse = await response.json();
      onCompanySelect(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load company details");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Clear selection
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setError(null);
    setHighlightedIndex(-1);
    onClear?.();
    inputRef.current?.focus();
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "dissolved":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  // If company is selected, show selected state
  if (selectedCompany) {
    return (
      <div className="relative">
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#0ea5e9]/30 bg-[#0ea5e9]/5">
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="size-5 text-[#0ea5e9]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {selectedCompany.name}
            </p>
            <p className="text-xs text-[var(--mmk-text-secondary)]">
              CRN: {selectedCompany.number}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <button
              onClick={handleClear}
              className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              type="button"
              title="Clear selection"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isSearching || isLoadingProfile ? (
            <Loader2 className="size-4 animate-spin text-[#0ea5e9]" />
          ) : (
            <Search className="size-4" />
          )}
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by company name or number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          className="pl-10 pr-10 rounded-xl border-[var(--mmk-border)] h-11"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading profile indicator */}
      {isLoadingProfile && (
        <div className="mt-2 flex items-center gap-2 text-sm text-[#0ea5e9]">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading company details...</span>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border border-[var(--mmk-border-light)] rounded-2xl shadow-xl overflow-hidden max-h-[380px] overflow-y-auto"
        >
          <div className="p-2 border-b border-[var(--mmk-border-light)]">
            <p className="text-xs text-muted-foreground px-2">
              {results.length} companies found — Select one to auto-fill details
            </p>
          </div>

          {results.map((company, index) => (
            <button
              key={company.company_number}
              type="button"
              onClick={() => handleSelectCompany(company)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`w-full text-left p-3 border-b border-[var(--mmk-border-light)] last:border-b-0 transition-colors ${
                highlightedIndex === index
                  ? "bg-[#0ea5e9]/5"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    company.company_status === "active"
                      ? "bg-[#0ea5e9]/10"
                      : "bg-muted"
                  }`}
                >
                  <Building2
                    className={`size-4 ${
                      company.company_status === "active"
                        ? "text-[#0ea5e9]"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm truncate">
                      {company.company_name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${getStatusColor(
                        company.company_status
                      )}`}
                    >
                      {company.company_status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{company.company_number}</span>
                    <span className="text-[var(--mmk-border)]">|</span>
                    <span className="uppercase text-[10px]">
                      {company.company_type?.replace(/-/g, " ")}
                    </span>
                  </div>
                  {company.address_snippet && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 flex-shrink-0" />
                      <span className="truncate">
                        {company.address_snippet}
                      </span>
                    </div>
                  )}
                  {company.date_of_creation && (
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <Calendar className="size-3 flex-shrink-0" />
                      <span>
                        Incorporated{" "}
                        {new Date(company.date_of_creation).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showDropdown && results.length === 0 && !isSearching && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border border-[var(--mmk-border-light)] rounded-2xl shadow-xl p-6 text-center"
        >
          <Building2 className="size-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">No companies found</p>
          <p className="text-xs text-muted-foreground">
            Try a different company name or enter the company number directly
          </p>
        </div>
      )}
    </div>
  );
}
