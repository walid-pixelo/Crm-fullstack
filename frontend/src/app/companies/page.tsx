// "use client";
//
// import { useEffect, useState } from "react";
//
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
//
// type Company = {
//   company_id: number;
//   company_name: string;
//   industry: string | null;
//   headquarter: string | null;
//   company_type: string | null;
//   employee_count: number | null;
//   company_address: string | null;
//   establishment_date: string | null;
//   company_summary: string | null;
//   company_website: string | null;
//   domain_name: string | null;
//   status: string | null;
//   city: string | null;
//   country: string | null;
// };
//
// type PaginatedResponse<T> = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// };
//
// export default function CompaniesPage() {
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
//
//   const [loading, setLoading] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [countryFilter, setCountryFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//
//   const [total, setTotal] = useState(0);
//   const pageSize = 50;
//
//   // -------- LIST FETCH --------
//   async function fetchCompanies() {
//     try {
//       setLoading(true);
//       setError(null);
//
//       const params = new URLSearchParams();
//       params.set("page", String(page));
//       params.set("page_size", String(pageSize));
//
//       if (search.trim()) {
//         params.set("search", search.trim());
//       }
//       if (countryFilter) {
//         params.set("country", countryFilter);
//       }
//       if (typeFilter) {
//         params.set("company_type", typeFilter);
//       }
//
//       const url = `${API_BASE_URL}/companies/?${params.toString()}`;
//       const res = await fetch(url);
//
//       if (!res.ok) {
//         throw new Error(`Company list request failed: ${res.status}`);
//       }
//
//       const data: PaginatedResponse<Company> = await res.json();
//       setCompanies(data.results || []);
//       setTotal(data.count ?? 0);
//
//       // auto-select first row if none selected
//       if (!selectedId && data.results && data.results.length > 0) {
//         setSelectedId(data.results[0].company_id);
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message ?? "Failed to load companies");
//     } finally {
//       setLoading(false);
//     }
//   }
//
//   // fetch on page / filters change
//   useEffect(() => {
//     fetchCompanies();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, countryFilter, typeFilter]);
//
//   // debounce search
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setPage(1);
//       fetchCompanies();
//     }, 400);
//     return () => clearTimeout(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);
//
//   // -------- DETAIL FETCH --------
//   async function fetchCompanyDetail(companyId: number | null) {
//     if (!companyId) {
//       setSelectedCompany(null);
//       return;
//     }
//
//     try {
//       setDetailLoading(true);
//
//       // IMPORTANT: trailing slash and correct path
//       const url = `${API_BASE_URL}/companies/${companyId}/`;
//       const companyRes = await fetch(url);
//
//       if (!companyRes.ok) {
//         throw new Error(`Company request failed: ${companyRes.status}`);
//       }
//
//       const companyData: Company = await companyRes.json();
//       setSelectedCompany(companyData);
//     } catch (err) {
//       console.error(err);
//       // don’t crash UI if detail fails
//       setSelectedCompany(null);
//     } finally {
//       setDetailLoading(false);
//     }
//   }
//
//   // load detail when selectedId changes
//   useEffect(() => {
//     fetchCompanyDetail(selectedId);
//   }, [selectedId]);
//
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//
//   // -------- UI --------
//   return (
//     <div
//       style={{
//         padding: 24,
//         fontFamily: "system-ui, -apple-system, sans-serif",
//         display: "flex",
//         flexDirection: "column",
//         gap: 16,
//       }}
//     >
//       <header
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h1 style={{ fontWeight: 600, fontSize: 22 }}>Companies</h1>
//         <span style={{ fontSize: 13, color: "#666" }}>
//           {loading
//             ? "Loading…"
//             : `Showing ${companies.length} of ${total} companies (page ${page}/${totalPages})`}
//         </span>
//       </header>
//
//       {/* Filters */}
//       <div
//         style={{
//           display: "flex",
//           gap: 12,
//           flexWrap: "wrap",
//           alignItems: "center",
//         }}
//       >
//         <input
//           type="text"
//           placeholder="Search company name, industry, website..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{
//             padding: "8px 10px",
//             minWidth: 260,
//             borderRadius: 6,
//             border: "1px solid #ddd",
//             fontSize: 14,
//           }}
//         />
//
//         <input
//           type="text"
//           placeholder="Country"
//           value={countryFilter}
//           onChange={(e) => {
//             setPage(1);
//             setCountryFilter(e.target.value);
//           }}
//           style={{
//             padding: "8px 10px",
//             width: 140,
//             borderRadius: 6,
//             border: "1px solid #ddd",
//             fontSize: 14,
//           }}
//         />
//
//         <input
//           type="text"
//           placeholder="Company type"
//           value={typeFilter}
//           onChange={(e) => {
//             setPage(1);
//             setTypeFilter(e.target.value);
//           }}
//           style={{
//             padding: "8px 10px",
//             width: 160,
//             borderRadius: 6,
//             border: "1px solid #ddd",
//             fontSize: 14,
//           }}
//         />
//       </div>
//
//       {error && (
//         <div
//           style={{
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
//       {/* Master + detail layout */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "2fr 1.2fr",
//           gap: 16,
//           alignItems: "flex-start",
//         }}
//       >
//         {/* Table */}
//         <div
//           style={{
//             border: "1px solid #eee",
//             borderRadius: 8,
//             overflow: "hidden",
//             background: "#fff",
//           }}
//         >
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: 13,
//             }}
//           >
//             <thead style={{ background: "#fafafa" }}>
//               <tr>
//                 <th style={thStyle}>Company</th>
//                 <th style={thStyle}>Industry</th>
//                 <th style={thStyle}>Type</th>
//                 <th style={thStyle}>Employees</th>
//                 <th style={thStyle}>Location</th>
//               </tr>
//             </thead>
//             <tbody>
//               {companies.length === 0 && !loading && (
//                 <tr>
//                   <td
//                     colSpan={5}
//                     style={{
//                       padding: 16,
//                       textAlign: "center",
//                       color: "#777",
//                     }}
//                   >
//                     No companies found.
//                   </td>
//                 </tr>
//               )}
//
//               {companies.map((c) => {
//                 const isSelected = selectedId === c.company_id;
//                 return (
//                   <tr
//                     key={c.company_id}
//                     onClick={() => setSelectedId(c.company_id)}
//                     style={{
//                       cursor: "pointer",
//                       backgroundColor: isSelected ? "#eef5ff" : "transparent",
//                     }}
//                   >
//                     <td style={tdStyle}>{c.company_name}</td>
//                     <td style={tdStyle}>{c.industry || "—"}</td>
//                     <td style={tdStyle}>{c.company_type || "—"}</td>
//                     <td style={tdStyle}>{c.employee_count ?? "—"}</td>
//                     <td style={tdStyle}>
//                       {c.city || c.country
//                         ? [c.city, c.country].filter(Boolean).join(", ")
//                         : "—"}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//
//           {/* Pagination */}
//           <div
//             style={{
//               padding: 10,
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               fontSize: 13,
//             }}
//           >
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page <= 1 || loading}
//               style={buttonStyle}
//             >
//               Prev
//             </button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <button
//               onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
//               disabled={page >= totalPages || loading}
//               style={buttonStyle}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//
//         {/* Detail panel */}
//         <div
//           style={{
//             border: "1px solid #eee",
//             borderRadius: 8,
//             padding: 16,
//             background: "#fff",
//             minHeight: 220,
//           }}
//         >
//           {detailLoading && <div style={{ fontSize: 13 }}>Loading…</div>}
//
//           {!detailLoading && !selectedCompany && (
//             <div style={{ fontSize: 13, color: "#777" }}>
//               Click a row to see company details.
//             </div>
//           )}
//
//           {selectedCompany && !detailLoading && (
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               <h2 style={{ fontSize: 18, fontWeight: 600 }}>
//                 {selectedCompany.company_name}
//               </h2>
//               <div style={{ fontSize: 13, color: "#555" }}>
//                 {selectedCompany.industry || "Industry not set"}
//               </div>
//
//               <div style={{ fontSize: 13 }}>
//                 <strong>Type:</strong>{" "}
//                 {selectedCompany.company_type || "—"}
//               </div>
//               <div style={{ fontSize: 13 }}>
//                 <strong>Employees:</strong>{" "}
//                 {selectedCompany.employee_count ?? "—"}
//               </div>
//               <div style={{ fontSize: 13 }}>
//                 <strong>Location:</strong>{" "}
//                 {selectedCompany.city || selectedCompany.country
//                   ? [selectedCompany.city, selectedCompany.country]
//                       .filter(Boolean)
//                       .join(", ")
//                   : "—"}
//               </div>
//               <div style={{ fontSize: 13 }}>
//                 <strong>Website:</strong>{" "}
//                 {selectedCompany.company_website ? (
//                   <a
//                     href={
//                       selectedCompany.company_website.startsWith("http")
//                         ? selectedCompany.company_website
//                         : `https://${selectedCompany.company_website}`
//                     }
//                     target="_blank"
//                     rel="noreferrer"
//                     style={{ color: "#2563eb" }}
//                   >
//                     {selectedCompany.company_website}
//                   </a>
//                 ) : (
//                   "—"
//                 )}
//               </div>
//               <div style={{ fontSize: 13 }}>
//                 <strong>Domain:</strong>{" "}
//                 {selectedCompany.domain_name || "—"}
//               </div>
//
//               {selectedCompany.company_summary && (
//                 <div style={{ fontSize: 13, marginTop: 8 }}>
//                   <strong>Summary:</strong>
//                   <p style={{ marginTop: 4 }}>
//                     {selectedCompany.company_summary}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
//
// const thStyle: React.CSSProperties = {
//   textAlign: "left",
//   padding: "10px 12px",
//   borderBottom: "1px solid #eee",
//   fontWeight: 600,
// };
//
// const tdStyle: React.CSSProperties = {
//   padding: "9px 12px",
//   borderBottom: "1px solid #f3f3f3",
// };
//
// const buttonStyle: React.CSSProperties = {
//   padding: "6px 12px",
//   borderRadius: 6,
//   border: "1px solid #ddd",
//   background: "#fff",
//   cursor: "pointer",
// };

//
// "use client";
//
// import React, { useState, useEffect } from "react";
//
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
//
// // Define the types for the contacts and pagination response
// type Contact = {
//   id?: number;
//   contact_id: number;
//   full_name: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   job_title: string | null;
//   company_name: string | null;
//   location: string | null;
//   status: string | null;
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
// const FilterSection = ({
//   title,
//   filters,
//   activeFilters,
//   setActiveFilters,
// }: {
//   title: string;
//   filters: string[];
//   activeFilters: string[];
//   setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
// }) => {
//   const toggleFilter = (filterName: string) => {
//     setActiveFilters((prev) =>
//       prev.includes(filterName)
//         ? prev.filter((item) => item !== filterName)
//         : [...prev, filterName]
//     );
//   };
//
//   return (
//     <div style={{ marginBottom: "24px" }}>
//       <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{title}</h3>
//       <div>
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => toggleFilter(filter)}
//             style={{
//               padding: "6px 12px",
//               margin: "6px 0",
//               borderRadius: "6px",
//               background: activeFilters.includes(filter) ? "#E015A" : "#f1f1f1",
//               color: activeFilters.includes(filter) ? "#fff" : "#333",
//               cursor: "pointer",
//               fontSize: "13px",
//             }}
//           >
//             {filter}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default function ContactsPage() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//
//   // UI state
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("");
//   const [activeFilters, setActiveFilters] = useState<string[]>([]);
//   const [total, setTotal] = useState(0);
//   const pageSize = 50; // matches DRF pagination
//
//   // Filters
//   const companyAttributes = [
//     "Annual Revenue",
//     "Company Headcount",
//     "Company Headcount Growth",
//     "Headquarters Location",
//     "Industry",
//   ];
//   const spotlights = ["Job Opportunities", "Recent Activities", "Connection"];
//   const workflowFilters = ["Companies in CRM", "Saved Accounts", "Account Lists"];
//
//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//
//       const params = new URLSearchParams();
//       params.set("page", String(page));
//       params.set("page_size", String(pageSize));
//
//       if (search.trim()) {
//         params.set("search", search.trim());
//       }
//
//       if (statusFilter) {
//         params.set("status", statusFilter);
//       }
//
//       // Adding active filters to the API request
//       activeFilters.forEach((filter) => {
//         params.set(filter, "true");
//       });
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
//   };
//
//   // Fetch when page / filters change
//   useEffect(() => {
//     fetchContacts();
//   }, [page, statusFilter, activeFilters]);
//
//   // Separate effect for search with small debounce
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setPage(1);
//       fetchContacts();
//     }, 400);
//
//     return () => clearTimeout(id);
//   }, [search]);
//
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//
//   return (
//     <div style={{ display: "flex", gap: "24px", padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
//       {/* Filters section */}
//       <div style={{ width: "300px", flexShrink: 0 }}>
//         <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>Filters</h1>
//
//         {/* Company Attributes */}
//         <FilterSection
//           title="Company Attributes"
//           filters={companyAttributes}
//           activeFilters={activeFilters}
//           setActiveFilters={setActiveFilters}
//         />
//
//         {/* Spotlights */}
//         <FilterSection
//           title="Spotlights"
//           filters={spotlights}
//           activeFilters={activeFilters}
//           setActiveFilters={setActiveFilters}
//         />
//
//         {/* Workflow Filters */}
//         <FilterSection
//           title="Workflow Filters"
//           filters={workflowFilters}
//           activeFilters={activeFilters}
//           setActiveFilters={setActiveFilters}
//         />
//       </div>
//
//       {/* Contacts Table Section */}
//       <div style={{ flex: 1 }}>
//         <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>Contacts</h1>
//
//         {/* Controls */}
//         <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
//           {/* Search box */}
//           <input
//             type="text"
//             placeholder="Search name, title, email, company..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               padding: "8px 10px",
//               minWidth: 260,
//               borderRadius: 6,
//               border: "1px solid #ddd",
//               fontSize: 14,
//             }}
//           />
//
//           {/* Status filter */}
//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setPage(1);
//               setStatusFilter(e.target.value);
//             }}
//             style={{
//               padding: "8px 10px",
//               borderRadius: 6,
//               border: "1px solid #ddd",
//               fontSize: 14,
//             }}
//           >
//             <option value="">All statuses</option>
//             <option value="New">New</option>
//             <option value="Working">Working</option>
//             <option value="Qualified">Qualified</option>
//             <option value="Unqualified">Unqualified</option>
//           </select>
//
//           <span style={{ fontSize: 13, color: "#666", marginLeft: "auto" }}>
//             {loading
//               ? "Loading…"
//               : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
//           </span>
//         </div>
//
//         {/* Error state */}
//         {error && (
//           <div
//             style={{
//               marginBottom: 12,
//               padding: 10,
//               borderRadius: 6,
//               background: "#ffe6e6",
//               color: "#b60000",
//               fontSize: 13,
//             }}
//           >
//             {error}
//           </div>
//         )}
//
//         {/* Table */}
//         <div
//           style={{
//             border: "1px solid #eee",
//             borderRadius: 8,
//             overflow: "hidden",
//             background: "#fff",
//           }}
//         >
//           <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//             <thead style={{ background: "#fafafa" }}>
//               <tr>
//                 <th style={thStyle}>Name</th>
//                 <th style={thStyle}>Job Title</th>
//                 <th style={thStyle}>Company</th>
//                 <th style={thStyle}>Location</th>
//                 <th style={thStyle}>Status</th>
//                 <th style={thStyle}>Official Email</th>
//                 <th style={thStyle}>Sales Nav</th>
//               </tr>
//             </thead>
//             <tbody>
//               {contacts.length === 0 && !loading && (
//                 <tr>
//                   <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#777" }}>
//                     No contacts found.
//                   </td>
//                 </tr>
//               )}
//
//               {contacts.map((c, index) => (
//                   <tr key={c.contact_id ?? c.id ?? index}>
//                   <td style={tdStyle}>
//                     <div style={{ fontWeight: 500 }}>
//                       {c.full_name ||
//                         `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//                         "—"}
//                     </div>
//                   </td>
//                   <td style={tdStyle}>{c.job_title || "—"}</td>
//                   <td style={tdStyle}>{c.company_name || "—"}</td>
//                   <td style={tdStyle}>{c.location || "—"}</td>
//                   <td style={tdStyle}>{c.status || "—"}</td>
//                   <td style={tdStyle}>{c.email || "—"}</td>
//                   <td style={tdStyle}>
//                     {c.sales_nav_profile_url ? (
//                       <a
//                         href={c.sales_nav_profile_url}
//                         target="_blank"
//                         rel="noreferrer"
//                         style={{ color: "#2563eb" }}
//                       >
//                         Open
//                       </a>
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//
//         {/* Pagination */}
//         <div
//           style={{
//             marginTop: 16,
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
//       </div>
//     </div>
//   );
// }
//
// const thStyle: React.CSSProperties = {
//   textAlign: "left",
//   padding: "10px 12px",
//   borderBottom: "1px solid #eee",
//   fontWeight: 600,
// };
//
// const tdStyle: React.CSSProperties = {
//   padding: "9px 12px",
//   borderBottom: "1px solid #f3f3f3",
// };
//
// const buttonStyle: React.CSSProperties = {
//   padding: "6px 12px",
//   borderRadius: 6,
//   border: "1px solid #ddd",
//   background: "#fff",
//   cursor: "pointer",
// };

"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Plus, Info } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Company = {
  id?: number;
  name: string;
  industry: string | null;
  location: string | null;
  size: string | null;
  revenue: string | null;
  founded: string | null;
  website: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const pageSize = 50;

  // Company Attribute Filters
  const [annualRevenue, setAnnualRevenue] = useState<string[]>([]);
  const [companyHeadcount, setCompanyHeadcount] = useState<string[]>([]);
  const [headcountGrowth, setHeadcountGrowth] = useState<string[]>([]);
  const [headquartersLocation, setHeadquartersLocation] = useState<string>("");
  const [industry, setIndustry] = useState<string[]>([]);

  // Spotlights Filters
  const [jobOpportunities, setJobOpportunities] = useState(false);
  const [recentActivities, setRecentActivities] = useState(false);
  const [connection, setConnection] = useState(false);

  // Workflow Filters
  const [companiesInCRM, setCompaniesInCRM] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState(false);
  const [accountLists, setAccountLists] = useState<string>("");

  // Filter section toggles
  const [filterSections, setFilterSections] = useState({
    companyAttributes: true,
    spotlights: false,
    workflow: false,
  });

  const toggleFilterSection = (section: keyof typeof filterSections) => {
    setFilterSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleArrayFilter = (
    currentFilters: string[],
    setFilter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (currentFilters.includes(value)) {
      setFilter(currentFilters.filter((v) => v !== value));
    } else {
      setFilter([...currentFilters, value]);
    }
    setPage(1);
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      // Company Attribute Filters
      if (annualRevenue.length > 0) annualRevenue.forEach(r => params.append("annual_revenue", r));
      if (companyHeadcount.length > 0) companyHeadcount.forEach(h => params.append("company_headcount", h));
      if (headcountGrowth.length > 0) headcountGrowth.forEach(g => params.append("headcount_growth", g));
      if (headquartersLocation.trim()) params.set("headquarters_location", headquartersLocation.trim());
      if (industry.length > 0) industry.forEach(i => params.append("industry", i));

      // Spotlights
      if (jobOpportunities) params.set("job_opportunities", "true");
      if (recentActivities) params.set("recent_activities", "true");
      if (connection) params.set("connection", "true");

      // Workflow
      if (companiesInCRM) params.set("companies_in_crm", "true");
      if (savedAccounts) params.set("saved_accounts", "true");
      if (accountLists.trim()) params.set("account_lists", accountLists.trim());

      const url = `${API_BASE_URL}/companies/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Company> = await res.json();
      setCompanies(data.results || []);
      setTotal(data.count ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [
    page,
    annualRevenue,
    companyHeadcount,
    headcountGrowth,
    headquartersLocation,
    industry,
    jobOpportunities,
    recentActivities,
    connection,
    companiesInCRM,
    savedAccounts,
    accountLists,
  ]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchCompanies();
    }, 400);

    return () => clearTimeout(id);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const clearFilters = () => {
    setAnnualRevenue([]);
    setCompanyHeadcount([]);
    setHeadcountGrowth([]);
    setHeadquartersLocation("");
    setIndustry([]);
    setJobOpportunities(false);
    setRecentActivities(false);
    setConnection(false);
    setCompaniesInCRM(false);
    setSavedAccounts(false);
    setAccountLists("");
    setPage(1);
  };

  const hasActiveFilters =
    annualRevenue.length > 0 ||
    companyHeadcount.length > 0 ||
    headcountGrowth.length > 0 ||
    headquartersLocation ||
    industry.length > 0 ||
    jobOpportunities ||
    recentActivities ||
    connection ||
    companiesInCRM ||
    savedAccounts ||
    accountLists;

  const FilterLabel = ({ text, hasInfo = false }: { text: string; hasInfo?: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span>{text}</span>
      {hasInfo && <Info size={14} style={{ color: "#9ca3af" }} />}
    </div>
  );

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: 40,
        height: 20,
        borderRadius: 10,
        background: checked ? "#0a66c2" : "#d1d5db",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 2,
          left: checked ? 22 : 2,
          transition: "left 0.2s",
        }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* LEFT SIDEBAR - FILTERS */}
      <aside style={{ width: 320, borderRight: "1px solid #e5e7eb", background: "#fff", overflowY: "auto" }}>
        {/* Filters Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Filters</h2>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
            <button onClick={clearFilters} style={{ fontSize: 13, color: "#0a66c2", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Clear all
            </button>
          </div>
        )}

        {/* COMPANY ATTRIBUTES */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button onClick={() => toggleFilterSection("companyAttributes")} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            <span>Company Attributes</span>
            {filterSections.companyAttributes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {filterSections.companyAttributes && (
            <div style={{ padding: "0 16px 16px" }}>
              {/* Annual Revenue */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Annual Revenue" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                {["$0-$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M-$500M", "$500M+"].map((revenue) => (
                  <label key={revenue} style={{ display: "flex", alignItems: "center", padding: "6px 0", cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={annualRevenue.includes(revenue)} onChange={() => toggleArrayFilter(annualRevenue, setAnnualRevenue, revenue)} style={{ marginRight: 8, width: 14, height: 14 }} />
                    {revenue}
                  </label>
                ))}
              </div>

              {/* Company Headcount */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Company Headcount" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                {["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000", "10001+"].map((size) => (
                  <label key={size} style={{ display: "flex", alignItems: "center", padding: "6px 0", cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={companyHeadcount.includes(size)} onChange={() => toggleArrayFilter(companyHeadcount, setCompanyHeadcount, size)} style={{ marginRight: 8, width: 14, height: 14 }} />
                    {size}
                  </label>
                ))}
              </div>

              {/* Company Headcount Growth */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Company Headcount Growth" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                {["Declining (-20%+)", "Steady (-10% to +10%)", "Growing (10%+)", "Rapidly Growing (20%+)"].map((growth) => (
                  <label key={growth} style={{ display: "flex", alignItems: "center", padding: "6px 0", cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={headcountGrowth.includes(growth)} onChange={() => toggleArrayFilter(headcountGrowth, setHeadcountGrowth, growth)} style={{ marginRight: 8, width: 14, height: 14 }} />
                    {growth}
                  </label>
                ))}
              </div>

              {/* Headquarters Location */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Headquarters Location" />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                <input type="text" placeholder="Search location" value={headquartersLocation} onChange={(e) => setHeadquartersLocation(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 13 }} />
              </div>

              {/* Industry */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Industry" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                {["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Real Estate", "Consulting"].map((ind) => (
                  <label key={ind} style={{ display: "flex", alignItems: "center", padding: "6px 0", cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={industry.includes(ind)} onChange={() => toggleArrayFilter(industry, setIndustry, ind)} style={{ marginRight: 8, width: 14, height: 14 }} />
                    {ind}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SPOTLIGHTS */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button onClick={() => toggleFilterSection("spotlights")} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            <span>Spotlights</span>
            {filterSections.spotlights ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {filterSections.spotlights && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Job Opportunities" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                  <ToggleSwitch checked={jobOpportunities} onChange={() => setJobOpportunities(!jobOpportunities)} />
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Recent Activities" hasInfo />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                  <ToggleSwitch checked={recentActivities} onChange={() => setRecentActivities(!recentActivities)} />
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Connection" />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                  <ToggleSwitch checked={connection} onChange={() => setConnection(!connection)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WORKFLOW FILTERS */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button onClick={() => toggleFilterSection("workflow")} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            <span>Workflow Filters</span>
            {filterSections.workflow ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {filterSections.workflow && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 13 }}>Companies in CRM</span>
                  <Info size={14} style={{ color: "#9ca3af" }} />
                </div>
                <ToggleSwitch checked={companiesInCRM} onChange={() => setCompaniesInCRM(!companiesInCRM)} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", marginBottom: 12 }}>
                <span style={{ fontSize: 13 }}>Saved Accounts</span>
                <ToggleSwitch checked={savedAccounts} onChange={() => setSavedAccounts(!savedAccounts)} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, fontSize: 13, color: "#374151" }}>
                  <FilterLabel text="Account Lists" />
                  <Plus size={14} style={{ marginLeft: "auto", color: "#6b7280" }} />
                </div>
                <input type="text" placeholder="Select account list" value={accountLists} onChange={(e) => setAccountLists(e.target.value)} style={{ width: "100%", padding: "6px 10px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 13 }} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        {/* Top Bar */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 16, background: "#fff" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0, marginBottom: 4 }}>Companies</h1>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {loading ? "Loading..." : `Showing ${companies.length} of ${total} companies (page ${page}/${totalPages})`}
            </div>
          </div>
          <div style={{ flex: 2, maxWidth: 500, position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={18} />
            <input type="text" placeholder="Search company name, industry..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", padding: "10px 14px 10px 44px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
          </div>
          <select style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14, background: "#fff", cursor: "pointer" }}>
            <option>All industries</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ margin: "16px 24px 0", padding: 12, borderRadius: 8, background: "#fee2e2", color: "#991b1b", fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Table Container */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Company</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Industry</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Location</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Size</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Revenue</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Founded</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Website</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>
                      No companies found.
                    </td>
                  </tr>
                )}
                {companies.map((c, index) => (
                  <tr key={c.id ?? index} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{c.name || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.industry || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.location || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.size || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.revenue || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.founded || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {c.website ? (
                        <a href={c.website} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                          Visit
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: "12px 24px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: page <= 1 || loading ? "#f3f4f6" : "#fff", cursor: page <= 1 || loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500 }}>
            Previous
          </button>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))} disabled={page >= totalPages || loading} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: page >= totalPages || loading ? "#f3f4f6" : "#fff", cursor: page >= totalPages || loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500 }}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}