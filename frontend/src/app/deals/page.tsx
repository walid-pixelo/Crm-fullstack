// frontend/src/app/deals/page.tsx
"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Deal = {
  deal_id: number;
  deal_name: string;
  deal_stage: string | null;
  amount: string | number | null;
  close_date: string | null;
  deal_owner: string | null;
  company: number | null;
  contact: number | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [ownerFilter, setOwnerFilter] = useState<string>("");

  const [total, setTotal] = useState(0);
  const pageSize = 50;

  async function fetchDeals() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (search.trim()) {
        params.set("search", search.trim()); // DRF SearchFilter (deal_name)
      }
      if (stageFilter) {
        params.set("deal_stage", stageFilter); // filterset_fields
      }
      if (ownerFilter) {
        params.set("deal_owner", ownerFilter); // filterset_fields
      }

      const url = `${API_BASE_URL}/deals/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Deal> = await res.json();
      setDeals(data.results || []);
      setTotal(data.count ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  }

  // Fetch when page / filters change
  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, stageFilter, ownerFilter]);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchDeals();
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
        Deals
      </h1>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Search by deal name */}
        <input
          type="text"
          placeholder="Search deal name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 10px",
            minWidth: 220,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />

        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={(e) => {
            setPage(1);
            setStageFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        >
          <option value="">All stages</option>
          <option value="New">New</option>
          <option value="Qualification">Qualification</option>
          <option value="Proposal">Proposal</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed-Won">Closed-Won</option>
          <option value="Closed-Lost">Closed-Lost</option>
        </select>

        {/* Owner filter (free text) */}
        <input
          type="text"
          placeholder="Deal owner (exact match)"
          value={ownerFilter}
          onChange={(e) => {
            setPage(1);
            setOwnerFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            minWidth: 180,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />

        <span style={{ fontSize: 13, color: "#666", marginLeft: "auto" }}>
          {loading
            ? "Loading…"
            : `Showing ${deals.length} of ${total} deals (page ${page}/${totalPages})`}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 12,
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
              <th style={thStyle}>Deal</th>
              <th style={thStyle}>Stage</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Close date</th>
              <th style={thStyle}>Owner</th>
              <th style={thStyle}>Company ID</th>
              <th style={thStyle}>Contact ID</th>
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 16,
                    textAlign: "center",
                    color: "#777",
                  }}
                >
                  No deals found.
                </td>
              </tr>
            )}

            {deals.map((d) => (
              <tr key={d.deal_id}>
                <td style={tdStyle}>{d.deal_name}</td>
                <td style={tdStyle}>{d.deal_stage || "—"}</td>
                <td style={tdStyle}>
                  {d.amount === null || d.amount === undefined
                    ? "—"
                    : typeof d.amount === "string"
                    ? d.amount
                    : d.amount.toLocaleString()}
                </td>
                <td style={tdStyle}>{d.close_date || "—"}</td>
                <td style={tdStyle}>{d.deal_owner || "—"}</td>
                <td style={tdStyle}>{d.company ?? "—"}</td>
                <td style={tdStyle}>{d.contact ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: 16,
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
