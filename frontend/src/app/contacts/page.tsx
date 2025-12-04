// "use client";
//
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
//
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
//
// type Contact = {
//   contact_id: number;
//   full_name: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   job_title: string | null;
//   company_name: string | null;
//   location: string | null;
//   connection_degree: string | null;
//   duration: string | null;
//   status: string | null;
//   email_status: string | null;
//   official_email: string | null;
//   email: string | null;
//   sales_nav_profile_url: string | null;
// };
//
// type PaginatedResponse<T> = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// };
//
// export default function ContactsPage() {
//   const router = useRouter();
//
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const pageSize = 50;
//
//   // Filters
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [emailStatusFilter, setEmailStatusFilter] = useState("");
//   const [connectionDegreeFilter, setConnectionDegreeFilter] = useState("");
//   const [durationFilter, setDurationFilter] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//
//   async function fetchContacts() {
//     try {
//       setLoading(true);
//       setError(null);
//
//       const params = new URLSearchParams();
//       params.set("page", String(page));
//       params.set("page_size", String(pageSize));
//
//       const searchParts: string[] = [];
//       if (search.trim()) searchParts.push(search.trim());
//       if (locationFilter.trim()) searchParts.push(locationFilter.trim());
//       if (searchParts.length) {
//         params.set("search", searchParts.join(" "));
//       }
//
//       if (statusFilter) params.set("status", statusFilter);
//       if (emailStatusFilter) params.set("email_status", emailStatusFilter);
//       if (connectionDegreeFilter)
//         params.set("connection_degree", connectionDegreeFilter);
//       if (durationFilter) params.set("duration", durationFilter);
//
//       const url = `${API_BASE_URL}/contacts/?${params.toString()}`;
//       const res = await fetch(url);
//
//       if (!res.ok) {
//         throw new Error(`Request failed: ${res.status}`);
//       }
//
//       const data: PaginatedResponse<Contact> = await res.json();
//       setContacts(data.results || []);
//       setTotal(data.count ?? 0);
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Failed to load contacts");
//     } finally {
//       setLoading(false);
//     }
//   }
//
//   // Fetch when page or dropdown filters change
//   useEffect(() => {
//     fetchContacts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, statusFilter, emailStatusFilter, connectionDegreeFilter, durationFilter]);
//
//   // Debounce search + location
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setPage(1);
//       fetchContacts();
//     }, 400);
//
//     return () => clearTimeout(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, locationFilter]);
//
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//
//   const handleRowClick = (id: number) => {
//     router.push(`/contacts/${id}`);
//   };
//
//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "calc(100vh - 60px)",
//         fontFamily: "system-ui, -apple-system, sans-serif",
//       }}
//     >
//       {/* LEFT FILTER SIDEBAR (simple version) */}
//       <aside
//         style={{
//           width: 260,
//           borderRight: "1px solid #e5e7eb",
//           padding: "16px 14px",
//           background: "#fafafa",
//         }}
//       >
//         <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
//           Filters
//         </div>
//
//         <div style={sidebarSectionStyle}>
//           <div style={sidebarLabelStyle}>Status</div>
//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setPage(1);
//               setStatusFilter(e.target.value);
//             }}
//             style={sidebarSelectStyle}
//           >
//             <option value="">All</option>
//             <option value="New">New</option>
//             <option value="Working">Working</option>
//             <option value="Contacted">Contacted</option>
//             <option value="Nurture">Nurture</option>
//             <option value="Qualified">Qualified</option>
//             <option value="Unqualified">Unqualified</option>
//           </select>
//         </div>
//
//         <div style={sidebarSectionStyle}>
//           <div style={sidebarLabelStyle}>Email status</div>
//           <select
//             value={emailStatusFilter}
//             onChange={(e) => {
//               setPage(1);
//               setEmailStatusFilter(e.target.value);
//             }}
//             style={sidebarSelectStyle}
//           >
//             <option value="">Any</option>
//             <option value="verified">Verified</option>
//             <option value="catch-all">Catch-all</option>
//             <option value="risky">Risky</option>
//             <option value="invalid">Invalid</option>
//           </select>
//         </div>
//
//         <div style={sidebarSectionStyle}>
//           <div style={sidebarLabelStyle}>Connection degree</div>
//           <select
//             value={connectionDegreeFilter}
//             onChange={(e) => {
//               setPage(1);
//               setConnectionDegreeFilter(e.target.value);
//             }}
//             style={sidebarSelectStyle}
//           >
//             <option value="">Any</option>
//             <option value="1st">1st</option>
//             <option value="2nd">2nd</option>
//             <option value="3rd+">3rd+</option>
//           </select>
//         </div>
//
//         <div style={sidebarSectionStyle}>
//           <div style={sidebarLabelStyle}>Duration</div>
//           <select
//             value={durationFilter}
//             onChange={(e) => {
//               setPage(1);
//               setDurationFilter(e.target.value);
//             }}
//             style={sidebarSelectStyle}
//           >
//             <option value="">Any</option>
//             <option value="<1 year">&lt; 1 year</option>
//             <option value="1-2 years">1–2 years</option>
//             <option value="3-5 years">3–5 years</option>
//             <option value="5+ years">5+ years</option>
//           </select>
//         </div>
//
//         <div style={sidebarSectionStyle}>
//           <div style={sidebarLabelStyle}>Location</div>
//           <input
//             type="text"
//             value={locationFilter}
//             onChange={(e) => setLocationFilter(e.target.value)}
//             placeholder="City / Region"
//             style={sidebarInputStyle}
//           />
//         </div>
//       </aside>
//
//       {/* MAIN AREA */}
//       <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         {/* Top bar */}
//         <div
//           style={{
//             padding: "16px 20px",
//             borderBottom: "1px solid #e5e7eb",
//             display: "flex",
//             flexDirection: "column",
//             gap: 12,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
//               Contacts
//             </h1>
//             <span style={{ fontSize: 13, color: "#6b7280" }}>
//               {loading
//                 ? "Loading…"
//                 : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
//             </span>
//           </div>
//
//           <div
//             style={{
//               display: "flex",
//               gap: 12,
//               alignItems: "center",
//               flexWrap: "wrap",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Search name, title, company, email…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 padding: "8px 10px",
//                 minWidth: 260,
//                 borderRadius: 6,
//                 border: "1px solid #d1d5db",
//                 fontSize: 14,
//               }}
//             />
//
//             <button
//               onClick={() => {
//                 setSearch("");
//                 setStatusFilter("");
//                 setEmailStatusFilter("");
//                 setConnectionDegreeFilter("");
//                 setDurationFilter("");
//                 setLocationFilter("");
//                 setPage(1);
//               }}
//               style={{
//                 padding: "7px 12px",
//                 borderRadius: 6,
//                 border: "1px solid #d1d5db",
//                 background: "#fff",
//                 fontSize: 13,
//                 cursor: "pointer",
//               }}
//             >
//               Clear filters
//             </button>
//           </div>
//
//           {error && (
//             <div
//               style={{
//                 padding: 10,
//                 borderRadius: 6,
//                 background: "#fee2e2",
//                 color: "#b91c1c",
//                 fontSize: 13,
//               }}
//             >
//               {error}
//             </div>
//           )}
//         </div>
//
//         {/* Table area */}
//         <div style={{ flex: 1, overflow: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: 13,
//             }}
//           >
//             <thead>
//               <tr style={{ background: "#f9fafb" }}>
//                 <th style={thStyle}>
//                   <input type="checkbox" />
//                 </th>
//                 <th style={thStyle}>Name</th>
//                 <th style={thStyle}>Job title</th>
//                 <th style={thStyle}>Company</th>
//                 <th style={thStyle}>Email</th>
//                 <th style={thStyle}>Status</th>
//                 <th style={thStyle}>Email status</th>
//                 <th style={thStyle}>Location</th>
//                 <th style={thStyle}>Duration</th>
//                 <th style={thStyle}>Conn. degree</th>
//                 <th style={thStyle}>Sales Nav</th>
//               </tr>
//             </thead>
//             <tbody>
//               {contacts.length === 0 && !loading && (
//                 <tr>
//                   <td
//                     colSpan={11}
//                     style={{
//                       padding: 20,
//                       textAlign: "center",
//                       color: "#6b7280",
//                     }}
//                   >
//                     No contacts found.
//                   </td>
//                 </tr>
//               )}
//
//               {contacts.map((c) => {
//                 const name =
//                   c.full_name ||
//                   `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//                   "—";
//
//                 return (
//                   <tr
//                     key={c.contact_id}
//                     onClick={() => handleRowClick(c.contact_id)}
//                     style={{
//                       cursor: "pointer",
//                       borderBottom: "1px solid #f3f4f6",
//                     }}
//                   >
//                     <td style={tdStyle}>
//                       <input
//                         type="checkbox"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </td>
//                     <td style={tdStyle}>
//                       <div style={{ fontWeight: 500 }}>{name}</div>
//                     </td>
//                     <td style={tdStyle}>{c.job_title || "—"}</td>
//                     <td style={tdStyle}>{c.company_name || "—"}</td>
//                     <td style={tdStyle}>{c.official_email || c.email || "—"}</td>
//                     <td style={tdStyle}>{c.status || "—"}</td>
//                     <td style={tdStyle}>{c.email_status || "—"}</td>
//                     <td style={tdStyle}>{c.location || "—"}</td>
//                     <td style={tdStyle}>{c.duration || "—"}</td>
//                     <td style={tdStyle}>{c.connection_degree || "—"}</td>
//                     <td style={tdStyle}>
//                       {c.sales_nav_profile_url ? (
//                         <a
//                           href={c.sales_nav_profile_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           onClick={(e) => e.stopPropagation()}
//                           style={{ color: "#2563eb" }}
//                         >
//                           Open
//                         </a>
//                       ) : (
//                         "—"
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//
//         {/* Pagination */}
//         <div
//           style={{
//             padding: "10px 16px",
//             borderTop: "1px solid #e5e7eb",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             fontSize: 13,
//           }}
//         >
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page <= 1 || loading}
//             style={buttonStyle}
//           >
//             Prev
//           </button>
//
//           <span>
//             Page {page} of {totalPages}
//           </span>
//
//           <button
//             onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
//             disabled={page >= totalPages || loading}
//             style={buttonStyle}
//           >
//             Next
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }
//
// const thStyle: React.CSSProperties = {
//   textAlign: "left",
//   padding: "8px 10px",
//   borderBottom: "1px solid #e5e7eb",
//   fontWeight: 600,
//   fontSize: 12,
//   color: "#4b5563",
//   whiteSpace: "nowrap",
// };
//
// const tdStyle: React.CSSProperties = {
//   padding: "8px 10px",
//   fontSize: 13,
//   color: "#111827",
// };
//
// const buttonStyle: React.CSSProperties = {
//   padding: "6px 12px",
//   borderRadius: 6,
//   border: "1px solid #d1d5db",
//   background: "#fff",
//   cursor: "pointer",
// };
//
// const sidebarSectionStyle: React.CSSProperties = {
//   marginBottom: 14,
// };
//
// const sidebarLabelStyle: React.CSSProperties = {
//   fontSize: 12,
//   fontWeight: 500,
//   color: "#4b5563",
//   marginBottom: 4,
// };
//
// const sidebarSelectStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "6px 8px",
//   borderRadius: 6,
//   border: "1px solid #d1d5db",
//   fontSize: 13,
// };
//
// const sidebarInputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "6px 8px",
//   borderRadius: 6,
//   border: "1px solid #d1d5db",
//   fontSize: 13,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* LEFT SIDEBAR FILTERS (Apollo-style) */}
      <div
        style={{
          width: 260,
          borderRight: "1px solid #eee",
          padding: 16,
          background: "#fafafa",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Filters
        </h2>

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
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Contacts
            </h1>
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
                    <td
                      colSpan={11}
                      style={{
                        padding: 16,
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
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
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            background: "#fafafa",
          }}
        >
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

/* Small presentational bits */

function FilterBlock(props: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 6,
          color: "#555",
        }}
      >
        {props.label}
      </div>
      {props.children}
    </div>
  );
}

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
