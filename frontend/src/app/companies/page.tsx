"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Company = {
  company_id: number;
  company_name: string;
  industry: string | null;
  headquarter: string | null;
  company_type: string | null;
  employee_count: number | null;
  company_address: string | null;
  establishment_date: string | null;
  company_summary: string | null;
  company_website: string | null;
  domain_name: string | null;
  status: string | null;
  city: string | null;
  country: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [total, setTotal] = useState(0);
  const pageSize = 50;

  // -------- LIST FETCH --------
  async function fetchCompanies() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (countryFilter) {
        params.set("country", countryFilter);
      }
      if (typeFilter) {
        params.set("company_type", typeFilter);
      }

      const url = `${API_BASE_URL}/companies/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Company list request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Company> = await res.json();
      setCompanies(data.results || []);
      setTotal(data.count ?? 0);

      // auto-select first row if none selected
      if (!selectedId && data.results && data.results.length > 0) {
        setSelectedId(data.results[0].company_id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }

  // fetch on page / filters change
  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, countryFilter, typeFilter]);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchCompanies();
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // -------- DETAIL FETCH --------
  async function fetchCompanyDetail(companyId: number | null) {
    if (!companyId) {
      setSelectedCompany(null);
      return;
    }

    try {
      setDetailLoading(true);

      // IMPORTANT: trailing slash and correct path
      const url = `${API_BASE_URL}/companies/${companyId}/`;
      const companyRes = await fetch(url);

      if (!companyRes.ok) {
        throw new Error(`Company request failed: ${companyRes.status}`);
      }

      const companyData: Company = await companyRes.json();
      setSelectedCompany(companyData);
    } catch (err) {
      console.error(err);
      // don’t crash UI if detail fails
      setSelectedCompany(null);
    } finally {
      setDetailLoading(false);
    }
  }

  // load detail when selectedId changes
  useEffect(() => {
    fetchCompanyDetail(selectedId);
  }, [selectedId]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // -------- UI --------
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontWeight: 600, fontSize: 22 }}>Companies</h1>
        <span style={{ fontSize: 13, color: "#666" }}>
          {loading
            ? "Loading…"
            : `Showing ${companies.length} of ${total} companies (page ${page}/${totalPages})`}
        </span>
      </header>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search company name, industry, website..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 10px",
            minWidth: 260,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />

        <input
          type="text"
          placeholder="Country"
          value={countryFilter}
          onChange={(e) => {
            setPage(1);
            setCountryFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            width: 140,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />

        <input
          type="text"
          placeholder="Company type"
          value={typeFilter}
          onChange={(e) => {
            setPage(1);
            setTypeFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            width: 160,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 6,
            background: "#ffe6e6",
            color: "#b60000",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Master + detail layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {/* Table */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead style={{ background: "#fafafa" }}>
              <tr>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Industry</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Employees</th>
                <th style={thStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#777",
                    }}
                  >
                    No companies found.
                  </td>
                </tr>
              )}

              {companies.map((c) => {
                const isSelected = selectedId === c.company_id;
                return (
                  <tr
                    key={c.company_id}
                    onClick={() => setSelectedId(c.company_id)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#eef5ff" : "transparent",
                    }}
                  >
                    <td style={tdStyle}>{c.company_name}</td>
                    <td style={tdStyle}>{c.industry || "—"}</td>
                    <td style={tdStyle}>{c.company_type || "—"}</td>
                    <td style={tdStyle}>{c.employee_count ?? "—"}</td>
                    <td style={tdStyle}>
                      {c.city || c.country
                        ? [c.city, c.country].filter(Boolean).join(", ")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            style={{
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              style={buttonStyle}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages || loading}
              style={buttonStyle}
            >
              Next
            </button>
          </div>
        </div>

        {/* Detail panel */}
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
            background: "#fff",
            minHeight: 220,
          }}
        >
          {detailLoading && <div style={{ fontSize: 13 }}>Loading…</div>}

          {!detailLoading && !selectedCompany && (
            <div style={{ fontSize: 13, color: "#777" }}>
              Click a row to see company details.
            </div>
          )}

          {selectedCompany && !detailLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                {selectedCompany.company_name}
              </h2>
              <div style={{ fontSize: 13, color: "#555" }}>
                {selectedCompany.industry || "Industry not set"}
              </div>

              <div style={{ fontSize: 13 }}>
                <strong>Type:</strong>{" "}
                {selectedCompany.company_type || "—"}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Employees:</strong>{" "}
                {selectedCompany.employee_count ?? "—"}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Location:</strong>{" "}
                {selectedCompany.city || selectedCompany.country
                  ? [selectedCompany.city, selectedCompany.country]
                      .filter(Boolean)
                      .join(", ")
                  : "—"}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Website:</strong>{" "}
                {selectedCompany.company_website ? (
                  <a
                    href={
                      selectedCompany.company_website.startsWith("http")
                        ? selectedCompany.company_website
                        : `https://${selectedCompany.company_website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb" }}
                  >
                    {selectedCompany.company_website}
                  </a>
                ) : (
                  "—"
                )}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Domain:</strong>{" "}
                {selectedCompany.domain_name || "—"}
              </div>

              {selectedCompany.company_summary && (
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <strong>Summary:</strong>
                  <p style={{ marginTop: 4 }}>
                    {selectedCompany.company_summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderBottom: "1px solid #f3f3f3",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};
