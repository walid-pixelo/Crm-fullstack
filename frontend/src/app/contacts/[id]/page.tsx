// "use client";
//
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import type React from "react";
//
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
//
// // ---- Types ----
// type Contact = {
//   contact_id: number;
//   full_name: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   job_title: string | null;
//   company: number | null;         // company_id FK
//   company_name: string | null;
//   location: string | null;
//   status: string | null;
//   official_email: string | null;
//   email: string | null;
//   sales_nav_profile_url: string | null;
// };
//
// type Deal = {
//   deal_id: number;
//   deal_name: string;
//   deal_stage: string;
//   amount: string | null;
//   close_date: string | null;
// };
//
// type Activity = {
//   activity_id: number;
//   activity_type: string;
//   activity_date: string;
//   activity_outcome: string | null;
//   notes: string | null;
// };
//
// type PaginatedResponse<T> = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// };
//
// export default function ContactDetailPage() {
//   const params = useParams<{ id: string }>();
//   const router = useRouter();
//   const contactId = params?.id;
//
//   const [contact, setContact] = useState<Contact | null>(null);
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   async function fetchContactAndRelated() {
//     if (!contactId) return;
//
//     try {
//       setLoading(true);
//       setError(null);
//
//       // 1) contact
//       const contactRes = await fetch(
//         `${API_BASE_URL}/contacts/${contactId}/`
//       );
//       if (!contactRes.ok) {
//         throw new Error("Contact not found");
//       }
//       const contactData: Contact = await contactRes.json();
//       setContact(contactData);
//
//       // 2) deals + activities in parallel
//       const [dealsRes, activitiesRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/deals/?contact_id=${contactId}`),
//         fetch(`${API_BASE_URL}/activities/?contact_id=${contactId}`),
//       ]);
//
//       if (dealsRes.ok) {
//         const dealsData: PaginatedResponse<Deal> = await dealsRes.json();
//         setDeals(dealsData.results || []);
//       } else {
//         setDeals([]);
//       }
//
//       if (activitiesRes.ok) {
//         const actData: PaginatedResponse<Activity> = await activitiesRes.json();
//         setActivities(actData.results || []);
//       } else {
//         setActivities([]);
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Failed to load contact");
//     } finally {
//       setLoading(false);
//     }
//   }
//
//   useEffect(() => {
//     fetchContactAndRelated();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [contactId]);
//
//   const name =
//     contact?.full_name ||
//     `${contact?.first_name || ""} ${contact?.last_name || ""}`.trim();
//
//   return (
//     <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
//       {/* Top bar */}
//       <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
//         <button
//           onClick={() => router.push("/contacts")}
//           style={backButtonStyle}
//         >
//           ← Back to contacts
//         </button>
//         <h1 style={{ fontWeight: 600, fontSize: 22, marginLeft: 12 }}>
//           Contact details
//         </h1>
//       </div>
//
//       {loading && <p>Loading…</p>}
//
//       {error && (
//         <div
//           style={{
//             marginBottom: 12,
//             padding: 10,
//             borderRadius: 6,
//             background: "#ffe6e6",
//             color: "#b60000",
//             fontSize: 13,
//           }}
//         >
//           {error}
//         </div>
//       )}
//
//       {!loading && contact && (
//         <>
//           {/* Top section: Contact + Company */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "2fr 1.5fr",
//               gap: 16,
//               marginBottom: 24,
//               alignItems: "stretch",
//             }}
//           >
//             {/* Contact card */}
//             <div style={cardStyle}>
//               <h2 style={cardTitleStyle}>{name || "Unnamed contact"}</h2>
//               <p style={mutedStyle}>{contact.job_title || "No title"}</p>
//
//               <div style={{ marginTop: 12 }}>
//                 <Row label="Email" value={contact.official_email || contact.email} />
//                 <Row label="Status" value={contact.status} />
//                 <Row label="Location" value={contact.location} />
//                 <Row
//                   label="Sales Nav"
//                   value={
//                     contact.sales_nav_profile_url ? (
//                       <a
//                         href={contact.sales_nav_profile_url}
//                         target="_blank"
//                         rel="noreferrer"
//                         style={{ color: "#2563eb" }}
//                       >
//                         Open profile
//                       </a>
//                     ) : (
//                       "—"
//                     )
//                   }
//                 />
//               </div>
//             </div>
//
//             {/* Company card */}
//             <div style={cardStyle}>
//               <h2 style={cardTitleStyle}>Company</h2>
//               <p style={{ fontWeight: 500 }}>
//                 {contact.company_name || "No company"}
//               </p>
//               {contact.company && (
//                 <button
//                   style={smallLinkButtonStyle}
//                   onClick={() => router.push(`/companies?company_id=${contact.company}`)}
//                 >
//                   View in Companies table →
//                 </button>
//               )}
//             </div>
//           </div>
//
//           {/* Bottom section: Deals + Activities */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1.2fr 1.8fr",
//               gap: 16,
//             }}
//           >
//             {/* Deals */}
//             <div style={cardStyle}>
//               <h3 style={cardTitleStyle}>Deals ({deals.length})</h3>
//               {deals.length === 0 ? (
//                 <p style={mutedStyle}>No deals for this contact.</p>
//               ) : (
//                 <table style={subTableStyle}>
//                   <thead>
//                     <tr>
//                       <th style={thMini}>Name</th>
//                       <th style={thMini}>Stage</th>
//                       <th style={thMini}>Amount</th>
//                       <th style={thMini}>Close date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {deals.map((d) => (
//                       <tr key={d.deal_id}>
//                         <td style={tdMini}>{d.deal_name}</td>
//                         <td style={tdMini}>{d.deal_stage}</td>
//                         <td style={tdMini}>{d.amount || "—"}</td>
//                         <td style={tdMini}>{d.close_date || "—"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//
//             {/* Activities */}
//             <div style={cardStyle}>
//               <h3 style={cardTitleStyle}>Activities ({activities.length})</h3>
//               {activities.length === 0 ? (
//                 <p style={mutedStyle}>No activities for this contact.</p>
//               ) : (
//                 <table style={subTableStyle}>
//                   <thead>
//                     <tr>
//                       <th style={thMini}>Type</th>
//                       <th style={thMini}>Date</th>
//                       <th style={thMini}>Outcome</th>
//                       <th style={thMini}>Notes</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {activities.map((a) => (
//                       <tr key={a.activity_id}>
//                         <td style={tdMini}>{a.activity_type}</td>
//                         <td style={tdMini}>
//                           {new Date(a.activity_date).toLocaleString()}
//                         </td>
//                         <td style={tdMini}>{a.activity_outcome || "—"}</td>
//                         <td style={tdMini}>
//                           {a.notes ? a.notes.slice(0, 60) : "—"}
//                           {a.notes && a.notes.length > 60 ? "…" : ""}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
//
// // ---- Small presentational pieces ----
//
// const Row = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: React.ReactNode | null | undefined;
// }) => (
//   <div style={{ display: "flex", marginBottom: 6, fontSize: 14 }}>
//     <div style={{ width: 90, color: "#555" }}>{label}</div>
//     <div style={{ flex: 1 }}>{value || "—"}</div>
//   </div>
// );
//
// const cardStyle: React.CSSProperties = {
//   borderRadius: 10,
//   border: "1px solid #eee",
//   padding: 16,
//   background: "#fff",
// };
//
// const cardTitleStyle: React.CSSProperties = {
//   fontSize: 16,
//   fontWeight: 600,
//   marginBottom: 4,
// };
//
// const mutedStyle: React.CSSProperties = {
//   fontSize: 13,
//   color: "#666",
// };
//
// const backButtonStyle: React.CSSProperties = {
//   padding: "6px 10px",
//   borderRadius: 6,
//   border: "1px solid #ddd",
//   background: "#fff",
//   cursor: "pointer",
//   fontSize: 13,
// };
//
// const smallLinkButtonStyle: React.CSSProperties = {
//   marginTop: 8,
//   padding: "4px 8px",
//   borderRadius: 6,
//   border: "1px solid #ddd",
//   background: "#fff",
//   cursor: "pointer",
//   fontSize: 12,
// };
//
// const subTableStyle: React.CSSProperties = {
//   width: "100%",
//   borderCollapse: "collapse",
//   fontSize: 13,
//   marginTop: 8,
// };
//
// const thMini: React.CSSProperties = {
//   textAlign: "left",
//   padding: "6px 8px",
//   borderBottom: "1px solid #eee",
//   fontWeight: 600,
// };
//
// const tdMini: React.CSSProperties = {
//   padding: "6px 8px",
//   borderBottom: "1px solid #f5f5f5",
// };

"use client";

import React, { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Contact = {
  contact_id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  connection_degree: string | null;
  duration: string | null;
  status: string | null;
  email_status: string | null;
  official_email: string | null;
  email: string | null;
  sales_nav_profile_url: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);

  // Top search bar (name/email/etc.)
  const [search, setSearch] = useState("");

  // Left sidebar filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [emailStatusFilter, setEmailStatusFilter] = useState<string>("");
  const [connectionDegreeFilter, setConnectionDegreeFilter] =
    useState<string>("");
  const [durationFilter, setDurationFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState<string>("");

  async function fetchContacts() {
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
      if (emailStatusFilter) {
        params.set("email_status", emailStatusFilter);
      }
      if (connectionDegreeFilter) {
        params.set("connection_degree", connectionDegreeFilter);
      }
      if (durationFilter) {
        params.set("duration", durationFilter);
      }
      if (locationFilter.trim()) {
        params.set("location", locationFilter.trim());
      }
      if (jobTitleFilter.trim()) {
        params.set("job_title", jobTitleFilter.trim());
      }
      if (companyFilter.trim()) {
        params.set("company_name", companyFilter.trim());
      }

      const url = `${API_BASE_URL}/contacts/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Contact> = await res.json();
      setContacts(data.results || []);
      setTotal(data.count ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  // Refetch when filters/page change
  useEffect(() => {
    fetchContacts();
  }, [
    page,
    statusFilter,
    emailStatusFilter,
    connectionDegreeFilter,
    durationFilter,
    locationFilter,
    jobTitleFilter,
    companyFilter,
  ]);

  // Debounce top search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchContacts();
    }, 400);

    return () => clearTimeout(id);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function clearFilters() {
    setStatusFilter("");
    setEmailStatusFilter("");
    setConnectionDegreeFilter("");
    setDurationFilter("");
    setLocationFilter("");
    setJobTitleFilter("");
    setCompanyFilter("");
    setPage(1);
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* LEFT SIDEBAR FILTERS (Prospectoo-style) */}
      <div
        style={{
          width: 260,
          borderRight: "1px solid #eee",
          padding: 16,
          background: "#fafafa",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Filters</h2>

        {/* Status */}
        <FilterBlock label="Status">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Working">Working</option>
            <option value="Contacted">Contacted</option>
            <option value="Nurture">Nurture</option>
          </select>
        </FilterBlock>

        {/* Email status */}
        <FilterBlock label="Email status">
          <select
            value={emailStatusFilter}
            onChange={(e) => {
              setEmailStatusFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="">Any</option>
            <option value="verified">Verified</option>
            <option value="catch-all">Catch-all</option>
            <option value="invalid">Invalid</option>
            <option value="unknown">Unknown</option>
          </select>
        </FilterBlock>

        {/* Connection degree */}
        <FilterBlock label="Connection degree">
          <select
            value={connectionDegreeFilter}
            onChange={(e) => {
              setConnectionDegreeFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="">Any</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd+</option>
          </select>
        </FilterBlock>

        {/* Duration */}
        <FilterBlock label="Duration">
          <select
            value={durationFilter}
            onChange={(e) => {
              setDurationFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle}
          >
            <option value="">Any</option>
            <option value="3 months">≤ 3 months</option>
            <option value="6 months">≤ 6 months</option>
            <option value="1 year">≤ 1 year</option>
            <option value="2 years">≤ 2 years</option>
          </select>
        </FilterBlock>

        {/* Location */}
        <FilterBlock label="Location">
          <input
            type="text"
            placeholder="City / Region"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={inputStyle}
          />
        </FilterBlock>

        {/* Job title (separate search) */}
        <FilterBlock label="Job title">
          <input
            type="text"
            placeholder="Search job title"
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            style={inputStyle}
          />
        </FilterBlock>

        {/* Company name (separate search) */}
        <FilterBlock label="Company">
          <input
            type="text"
            placeholder="Search company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            style={inputStyle}
          />
        </FilterBlock>

        <button onClick={clearFilters} style={clearButtonStyle}>
          Clear filters
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar with title + search + summary */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Prospectoo CRM</h1>
            <div style={{ fontSize: 12, color: "#666" }}>
              {loading
                ? "Loading…"
                : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
            </div>
          </div>

          <div style={{ flex: 2, maxWidth: 420 }}>
            <input
              type="text"
              placeholder="Search name, email, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid #ddd",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        {/* Error box */}
        {error && (
          <div
            style={{
              margin: "12px 20px 0",
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
            flex: 1,
            overflow: "auto",
            padding: 20,
          }}
        >
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
                  <th style={thStyle}>
                    <input type="checkbox" disabled />
                  </th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Job title</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Email status</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>Conn. degree</th>
                  <th style={thStyle}>Sales Nav</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={11} style={emptyRow}>
                      No contacts found.
                    </td>
                  </tr>
                )}

                {contacts.map((c) => {
                  const name =
                    c.full_name ||
                    `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                    "—";

                  const email = c.official_email || c.email || "—";

                  return (
                    <tr key={c.contact_id} style={{ cursor: "pointer" }}>
                      <td style={tdStyle}>
                        <input type="checkbox" />
                      </td>
                      <td style={tdStyle}>{name}</td>
                      <td style={tdStyle}>{c.job_title || "—"}</td>
                      <td style={tdStyle}>{c.company_name || "—"}</td>
                      <td style={tdStyle}>{email}</td>
                      <td style={tdStyle}>{c.status || "—"}</td>
                      <td style={tdStyle}>{c.email_status || "—"}</td>
                      <td style={tdStyle}>{c.location || "—"}</td>
                      <td style={tdStyle}>{c.duration || "—"}</td>
                      <td style={tdStyle}>{c.connection_degree || "—"}</td>
                      <td style={tdStyle}>
                        {c.sales_nav_profile_url ? (
                          <a
                            href={c.sales_nav_profile_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#2563eb" }}
                          >
                            Open
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination footer */}
        <div style={paginationRow}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            style={pagerButtonStyle}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages || loading}
            style={pagerButtonStyle}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* Styles for the UI elements */
const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
  background: "#fff",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
};

const clearButtonStyle: React.CSSProperties = {
  marginTop: 8,
  width: "100%",
  padding: "7px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "9px 12px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #f3f3f3",
  verticalAlign: "middle",
};

const pagerButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const paginationRow: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 13,
};
