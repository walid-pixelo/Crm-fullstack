"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  city: string | null;
  country: string | null;
};

type Contact = {
  contact_id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  official_email: string | null;
  email: string | null;
  status: string | null;
};

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // 1) Company detail
        const companyRes = await fetch(`${API_BASE_URL}/companies/${id}/`);
        if (!companyRes.ok) {
          throw new Error("Company not found");
        }
        const companyData: Company = await companyRes.json();
        setCompany(companyData);

        // 2) Contacts for this company (uses ?company=<id>)
        const contactsRes = await fetch(
          `${API_BASE_URL}/contacts/?company=${id}&page_size=50`
        );
        if (contactsRes.ok) {
          const contactsJson = await contactsRes.json();
          const results = Array.isArray(contactsJson.results)
            ? contactsJson.results
            : contactsJson;
          setContacts(results);
        } else {
          setContacts([]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load company");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  const name =
    company?.company_name ||
    (loading ? "Loading…" : error ? "Company not found" : "Company");

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{name}</h1>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
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

      {/* Company summary card */}
      {company && (
        <div
          style={{
            marginBottom: 24,
            padding: 16,
            borderRadius: 8,
            border: "1px solid #eee",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: "0 0 6px", color: "#555" }}>
                {company.industry || "Industry not set"}
              </p>
              <p style={{ margin: "0 0 4px", color: "#555" }}>
                {company.headquarter ||
                  company.city ||
                  company.country ||
                  "Location not set"}
              </p>
              <p style={{ margin: 0, color: "#777", fontSize: 13 }}>
                {company.company_type || "Company type not set"}
              </p>
            </div>

            <div style={{ textAlign: "right", fontSize: 13 }}>
              <p style={{ margin: "0 0 4px" }}>
                Employees:{" "}
                <strong>{company.employee_count ?? "Unknown"}</strong>
              </p>
              {company.company_website && (
                <p style={{ margin: 0 }}>
                  <a
                    href={company.company_website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#2563eb" }}
                  >
                    Visit website
                  </a>
                </p>
              )}
            </div>
          </div>

          {company.company_summary && (
            <p style={{ marginTop: 12, fontSize: 13, color: "#555" }}>
              {company.company_summary}
            </p>
          )}
        </div>
      )}

      {/* Contacts table */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        Contacts at {company?.company_name || ""}
      </h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>
        {loading
          ? "Loading contacts…"
          : `Showing ${contacts.length} contact(s) for this company.`}
      </p>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Official Email</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && !loading && (
              <tr>
                <td colSpan={4} style={{ padding: 16, textAlign: "center", color: "#777" }}>
                  No contacts for this company.
                </td>
              </tr>
            )}

            {contacts.map((c) => (
              <tr key={c.contact_id}>
                <td style={tdStyle}>
                  <a
                    href={`/contacts/${c.contact_id}`}
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    {c.full_name ||
                      `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                      "—"}
                  </a>
                </td>
                <td style={tdStyle}>{c.job_title || "—"}</td>
                <td style={tdStyle}>{c.status || "—"}</td>
                <td style={tdStyle}>{c.official_email || c.email || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
} as const;

const tdStyle = {
  padding: "9px 12px",
  borderBottom: "1px solid #f3f3f3",
} as const;
