"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Summary = {
  total_contacts: number;
  total_companies: number;
  new_contacts_today: number;
};

type StatusBucket = {
  status: string;
  total: number;
};

type IndustryBucket = {
  industry: string;
  total: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [statusBuckets, setStatusBuckets] = useState<StatusBucket[]>([]);
  const [industryBuckets, setIndustryBuckets] = useState<IndustryBucket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [summaryRes, statusRes, industryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/dashboard/summary/`),
        fetch(`${API_BASE_URL}/dashboard/contacts_by_status/`),
        fetch(`${API_BASE_URL}/dashboard/company_industry_stats/`),
      ]);

      if (!summaryRes.ok) {
        throw new Error(`summary: ${summaryRes.status}`);
      }
      if (!statusRes.ok) {
        throw new Error(`contacts_by_status: ${statusRes.status}`);
      }
      if (!industryRes.ok) {
        throw new Error(`company_industry_stats: ${industryRes.status}`);
      }

      const summaryData: Summary = await summaryRes.json();
      const statusData: StatusBucket[] = await statusRes.json();
      const industryData: IndustryBucket[] = await industryRes.json();

      setSummary(summaryData);
      setStatusBuckets(statusData);
      setIndustryBuckets(industryData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        Dashboard
      </h1>

      {loading && (
        <div style={{ marginBottom: 12, fontSize: 14 }}>Loading…</div>
      )}

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: "#fee2e2",
            color: "#b91c1c",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Top summary cards */}
      {summary && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <SummaryCard
            label="Total contacts"
            value={summary.total_contacts}
          />
          <SummaryCard
            label="Total companies"
            value={summary.total_companies}
          />
          <SummaryCard
            label="New contacts today"
            value={summary.new_contacts_today}
          />
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {/* Contacts by status */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            background: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Contacts by status
          </h2>
          {statusBuckets.length === 0 ? (
            <div style={{ fontSize: 13, color: "#6b7280" }}>No data</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {statusBuckets.map((row) => (
                <li
                  key={row.status}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 13,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span>{row.status}</span>
                  <span>{row.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Companies by industry */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 16,
            background: "#fff",
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Companies by industry
          </h2>
          {industryBuckets.length === 0 ? (
            <div style={{ fontSize: 13, color: "#6b7280" }}>No data</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {industryBuckets.map((row) => (
                <li
                  key={row.industry}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: 13,
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span>{row.industry}</span>
                  <span>{row.total}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}
