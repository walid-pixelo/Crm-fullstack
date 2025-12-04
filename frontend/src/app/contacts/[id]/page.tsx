"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type React from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

// ---- Types ----
type Contact = {
  contact_id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company: number | null;         // company_id FK
  company_name: string | null;
  location: string | null;
  status: string | null;
  official_email: string | null;
  email: string | null;
  sales_nav_profile_url: string | null;
};

type Deal = {
  deal_id: number;
  deal_name: string;
  deal_stage: string;
  amount: string | null;
  close_date: string | null;
};

type Activity = {
  activity_id: number;
  activity_type: string;
  activity_date: string;
  activity_outcome: string | null;
  notes: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const contactId = params?.id;

  const [contact, setContact] = useState<Contact | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContactAndRelated() {
    if (!contactId) return;

    try {
      setLoading(true);
      setError(null);

      // 1) contact
      const contactRes = await fetch(
        `${API_BASE_URL}/contacts/${contactId}/`
      );
      if (!contactRes.ok) {
        throw new Error("Contact not found");
      }
      const contactData: Contact = await contactRes.json();
      setContact(contactData);

      // 2) deals + activities in parallel
      const [dealsRes, activitiesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/deals/?contact_id=${contactId}`),
        fetch(`${API_BASE_URL}/activities/?contact_id=${contactId}`),
      ]);

      if (dealsRes.ok) {
        const dealsData: PaginatedResponse<Deal> = await dealsRes.json();
        setDeals(dealsData.results || []);
      } else {
        setDeals([]);
      }

      if (activitiesRes.ok) {
        const actData: PaginatedResponse<Activity> = await activitiesRes.json();
        setActivities(actData.results || []);
      } else {
        setActivities([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load contact");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContactAndRelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const name =
    contact?.full_name ||
    `${contact?.first_name || ""} ${contact?.last_name || ""}`.trim();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <button
          onClick={() => router.push("/contacts")}
          style={backButtonStyle}
        >
          ← Back to contacts
        </button>
        <h1 style={{ fontWeight: 600, fontSize: 22, marginLeft: 12 }}>
          Contact details
        </h1>
      </div>

      {loading && <p>Loading…</p>}

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

      {!loading && contact && (
        <>
          {/* Top section: Contact + Company */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr",
              gap: 16,
              marginBottom: 24,
              alignItems: "stretch",
            }}
          >
            {/* Contact card */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>{name || "Unnamed contact"}</h2>
              <p style={mutedStyle}>{contact.job_title || "No title"}</p>

              <div style={{ marginTop: 12 }}>
                <Row label="Email" value={contact.official_email || contact.email} />
                <Row label="Status" value={contact.status} />
                <Row label="Location" value={contact.location} />
                <Row
                  label="Sales Nav"
                  value={
                    contact.sales_nav_profile_url ? (
                      <a
                        href={contact.sales_nav_profile_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#2563eb" }}
                      >
                        Open profile
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>
            </div>

            {/* Company card */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Company</h2>
              <p style={{ fontWeight: 500 }}>
                {contact.company_name || "No company"}
              </p>
              {contact.company && (
                <button
                  style={smallLinkButtonStyle}
                  onClick={() => router.push(`/companies?company_id=${contact.company}`)}
                >
                  View in Companies table →
                </button>
              )}
            </div>
          </div>

          {/* Bottom section: Deals + Activities */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.8fr",
              gap: 16,
            }}
          >
            {/* Deals */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Deals ({deals.length})</h3>
              {deals.length === 0 ? (
                <p style={mutedStyle}>No deals for this contact.</p>
              ) : (
                <table style={subTableStyle}>
                  <thead>
                    <tr>
                      <th style={thMini}>Name</th>
                      <th style={thMini}>Stage</th>
                      <th style={thMini}>Amount</th>
                      <th style={thMini}>Close date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.map((d) => (
                      <tr key={d.deal_id}>
                        <td style={tdMini}>{d.deal_name}</td>
                        <td style={tdMini}>{d.deal_stage}</td>
                        <td style={tdMini}>{d.amount || "—"}</td>
                        <td style={tdMini}>{d.close_date || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Activities */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Activities ({activities.length})</h3>
              {activities.length === 0 ? (
                <p style={mutedStyle}>No activities for this contact.</p>
              ) : (
                <table style={subTableStyle}>
                  <thead>
                    <tr>
                      <th style={thMini}>Type</th>
                      <th style={thMini}>Date</th>
                      <th style={thMini}>Outcome</th>
                      <th style={thMini}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.activity_id}>
                        <td style={tdMini}>{a.activity_type}</td>
                        <td style={tdMini}>
                          {new Date(a.activity_date).toLocaleString()}
                        </td>
                        <td style={tdMini}>{a.activity_outcome || "—"}</td>
                        <td style={tdMini}>
                          {a.notes ? a.notes.slice(0, 60) : "—"}
                          {a.notes && a.notes.length > 60 ? "…" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---- Small presentational pieces ----

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode | null | undefined;
}) => (
  <div style={{ display: "flex", marginBottom: 6, fontSize: 14 }}>
    <div style={{ width: 90, color: "#555" }}>{label}</div>
    <div style={{ flex: 1 }}>{value || "—"}</div>
  </div>
);

const cardStyle: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid #eee",
  padding: 16,
  background: "#fff",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 4,
};

const mutedStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#666",
};

const backButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};

const smallLinkButtonStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "4px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};

const subTableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
  marginTop: 8,
};

const thMini: React.CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
};

const tdMini: React.CSSProperties = {
  padding: "6px 8px",
  borderBottom: "1px solid #f5f5f5",
};
