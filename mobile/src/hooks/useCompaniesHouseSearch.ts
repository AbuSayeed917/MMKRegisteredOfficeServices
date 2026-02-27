import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export interface CompanySearchResult {
  company_name: string;
  company_number: string;
  company_type: string;
  company_status: string;
  date_of_creation: string;
  address_snippet: string;
  address?: {
    premises?: string;
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

export function useCompaniesHouseSearch() {
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/companies-house/search", {
        params: { q: query, limit: 10 },
      });
      setResults(res.data.items || []);
    } catch {
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError("");
  }, []);

  return { results, loading, error, search, clear };
}
