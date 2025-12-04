"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Sequence = {
  sequence_id: number;
  sequence_name: string;
  status: string;
  sequence_steps: any;
  created_at: string;
  updated_at: string;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [total, setTotal] = useState(0);
  const pageSize = 50;

  async function fetchSequences() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const url = `${API_BASE_URL}/sequences/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Sequence> = await res.json();
      setSequences(data.results || []);
      setTotal(data.count ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load sequences");
    } finally {
      setLoading(false);
    }
  }

  // Fetch when page / filter change
  useEffect(() => {
    fetchSequences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchSequences();
    }, 400);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function formatDate(value: string) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  }

  function previewSteps(steps: any) {
    if (!steps) return "—";

    try {
      const arr = Array.isArray(steps) ? steps : JSON.parse(steps);
      if (!Array.isArray(arr) || arr.length === 0) return "—";

      const first = arr[0];
      const label =
        first?.type ||
        first?.step_type ||
        first?.name ||
        first?.subject ||
        "Step";

      const count = arr.length;
      if (count === 1) return label;
      return `${label} + ${count - 1} more`;
    } catch {
      return "Custom steps";
    }
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
        Sequences
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Search box */}
        <input
          type="text"
          placeholder="Search sequences…"
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

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>

        <span style={{ fontSize: 13, color: "#666", marginLeft: "auto" }}>
          {loading
            ? "Loading…"
            : `Showing ${sequences.length} of ${total} sequences (page ${page}/${totalPages})`}
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
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Steps</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {sequences.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: 16, textAlign: "center", color: "#777" }}
                >
                  No sequences found.
                </td>
              </tr>
            )}

            {sequences.map((s) => (
              <tr key={s.sequence_id}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500 }}>{s.sequence_name}</div>
                </td>
                <td style={tdStyle}>{s.status || "—"}</td>
                <td style={tdStyle}>{previewSteps(s.sequence_steps)}</td>
                <td style={tdStyle}>{formatDate(s.created_at)}</td>
                <td style={tdStyle}>{formatDate(s.updated_at)}</td>
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
