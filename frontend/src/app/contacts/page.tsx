//
//
// "use client";
//
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Search,
//   ChevronDown,
//   ChevronUp,
//   Plus,
//   Info,
//   User,
//   Bell,
//   Palette,
//   Globe,
//   CreditCard,
//   LogOut,
//   Smartphone,
// } from "lucide-react";
//
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
//
// type Contact = {
//   contact_id: number | null;
//   full_name: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   job_title: string | null;
//   company_name: string | null;
//   location: string | null;
//   duration: string | null;
//   status: string | null;
//   email_status: string | null;
//   official_email: string | null;
//   email: string | null;
//   connection_degree: string | null;
//   sales_nav_profile_url: string | null;
//
//   // optional phone fields (whatever your API returns)
//   phone?: string | null;
//   phone_number?: string | null;
// };
//
// type PaginatedResponse<T> = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// };
//
// type SelectionMode = "number" | "this_page" | "all" | null;
//
// const thCell: React.CSSProperties = {
//   padding: "12px 16px",
//   textAlign: "left",
//   fontWeight: 600,
//   color: "#374151",
//   whiteSpace: "nowrap",
// };
//
// const tdCell: React.CSSProperties = {
//   padding: "12px 16px",
//   color: "#6b7280",
// };
//
// const menuItemStyle: React.CSSProperties = {
//   width: "100%",
//   display: "flex",
//   alignItems: "center",
//   gap: 8,
//   padding: "8px 16px",
//   background: "none",
//   border: "none",
//   cursor: "pointer",
//   fontSize: 13,
//   color: "#374151",
// };
//
// const overlayStyle: React.CSSProperties = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.25)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 100,
// };
//
// const modalStyle: React.CSSProperties = {
//   width: 380,
//   maxWidth: "90vw",
//   background: "#fff",
//   borderRadius: 12,
//   padding: 20,
//   boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
// };
//
// const exportButtonStyle: React.CSSProperties = {
//   padding: "8px 14px",
//   borderRadius: 6,
//   border: "1px solid #d1d5db",
//   background: "#f9fafb",
//   cursor: "pointer",
//   fontSize: 14,
//   textAlign: "left",
// };
//
// export default function ContactsPage() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const pageSize = 50;
//   const [total, setTotal] = useState(0);
//   const [search, setSearch] = useState("");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const profileMenuRef = useRef<HTMLDivElement>(null);
//
//   // selection / export
//   const [headerChecked, setHeaderChecked] = useState(false);
//   const [showSelectionModal, setShowSelectionModal] = useState(false);
//   const [selectionMode, setSelectionMode] = useState<SelectionMode>("number");
//   const [selectNumber, setSelectNumber] = useState(25);
//   const [limitPerCompany, setLimitPerCompany] = useState(true);
//   const [maxPerCompany, setMaxPerCompany] = useState(2);
//   const [showExportModal, setShowExportModal] = useState(false);
//
//   // Company Filters
//   const [currentCompany, setCurrentCompany] = useState<string>("");
//   const [companyHeadcount, setCompanyHeadcount] = useState<string[]>([]);
//   const [pastCompany, setPastCompany] = useState<string>("");
//   const [companyType, setCompanyType] = useState<string[]>([]);
//   const [companyHqLocation, setCompanyHqLocation] = useState<string>("");
//
//   // Buyer Intent Filters
//   const [followingYourCompany, setFollowingYourCompany] = useState(false);
//   const [viewedProfileRecently, setViewedProfileRecently] = useState(false);
//
//   // Best Path Filters
//   const [connectionFilter, setConnectionFilter] = useState(false);
//   const [connectionsOf, setConnectionsOf] = useState<string>("");
//   const [pastColleague, setPastColleague] = useState(false);
//   const [sharedExperiences, setSharedExperiences] = useState(false);
//
//   // Recent Updates Filters
//   const [changedJobs, setChangedJobs] = useState(false);
//   const [postedOnLinkedIn, setPostedOnLinkedIn] = useState(false);
//
//   // Role Filters
//   const [functionFilter, setFunctionFilter] = useState<string[]>([]);
//   const [currentJobTitle, setCurrentJobTitle] = useState<string>("");
//   const [seniorityLevel, setSeniorityLevel] = useState<string[]>([]);
//   const [pastJobTitle, setPastJobTitle] = useState<string>("");
//   const [yearsInCurrentCompany, setYearsInCurrentCompany] =
//     useState<string>("");
//   const [yearsInCurrentPosition, setYearsInCurrentPosition] =
//     useState<string>("");
//
//   // Personal Filters
//   const [geography, setGeography] = useState<string>("");
//   const [industry, setIndustry] = useState<string[]>([]);
//
//   const [filterSections, setFilterSections] = useState({
//     company: true,
//     buyerIntent: false,
//     bestPath: false,
//     recentUpdates: false,
//     role: false,
//     personal: false,
//   });
//
//   // close profile menu on outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowProfileMenu(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//
//   const toggleFilterSection = (section: keyof typeof filterSections) => {
//     setFilterSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };
//
//   const toggleArrayFilter = (
//     currentFilters: string[],
//     setFilter: React.Dispatch<React.SetStateAction<string[]>>,
//     value: string
//   ) => {
//     if (currentFilters.includes(value)) {
//       setFilter(currentFilters.filter((v) => v !== value));
//     } else {
//       setFilter([...currentFilters, value]);
//     }
//     setPage(1);
//   };
//
//   // build URLSearchParams for all active filters
//   const buildFilterParams = () => {
//     const params = new URLSearchParams();
//
//     if (search.trim()) params.set("search", search.trim());
//     if (currentCompany.trim())
//       params.set("company_name", currentCompany.trim());
//     if (companyHeadcount.length > 0)
//       params.set("company_headcount", companyHeadcount[0]);
//     if (pastCompany.trim()) params.set("past_company", pastCompany.trim());
//     if (companyType.length > 0) params.set("company_type", companyType.join(","));
//     if (companyHqLocation.trim())
//       params.set("location", companyHqLocation.trim());
//     if (followingYourCompany) params.set("following_company", "true");
//     if (viewedProfileRecently) params.set("viewed_profile", "true");
//     if (connectionFilter) params.set("connection_1st", "true");
//     if (connectionsOf.trim()) params.set("connections_of", connectionsOf);
//     if (pastColleague) params.set("past_colleague", "true");
//     if (sharedExperiences) params.set("shared_experiences", "true");
//     if (changedJobs) params.set("changed_jobs", "true");
//     if (postedOnLinkedIn) params.set("posted_linkedin", "true");
//     if (functionFilter.length > 0)
//       params.set("function", functionFilter.join(","));
//     if (currentJobTitle.trim())
//       params.set("job_title", currentJobTitle.trim());
//     if (seniorityLevel.length > 0)
//       params.set("seniority", seniorityLevel.join(","));
//     if (pastJobTitle.trim())
//       params.set("past_job_title", pastJobTitle.trim());
//     if (yearsInCurrentCompany)
//       params.set("years_current_company", yearsInCurrentCompany);
//     if (yearsInCurrentPosition)
//       params.set("years_current_position", yearsInCurrentPosition);
//     if (geography.trim()) params.set("location", geography.trim());
//     if (industry.length > 0) params.set("industry", industry.join(","));
//
//     return params;
//   };
//
//   const handleHeaderCheckboxChange = () => {
//     setSelectionMode("number");
//     setShowSelectionModal(true);
//   };
//
//   const closeSelectionModal = () => {
//     setShowSelectionModal(false);
//     if (!showExportModal) setHeaderChecked(false);
//   };
//
//   const applySelection = () => {
//     setShowSelectionModal(false);
//     setHeaderChecked(true);
//     setShowExportModal(true);
//   };
//
//   const closeExportModal = () => {
//     setShowExportModal(false);
//     setHeaderChecked(false);
//   };
//
//   // NEW: export via /contacts/ + frontend CSV
//   const exportData = async (withEmail: boolean, withPhone: boolean) => {
//     try {
//       let exportCount = 0;
//
//       if (selectionMode === "number") {
//         exportCount = selectNumber;
//       } else if (selectionMode === "this_page") {
//         exportCount = contacts.length;
//       } else if (selectionMode === "all") {
//         exportCount = total;
//       }
//
//       if (exportCount <= 0) {
//         alert("Nothing to export");
//         return;
//       }
//
//       // collect contacts across pages
//       const collected: Contact[] = [];
//       const companyCounts: Record<string, number> = {};
//       const pageSizeExport = 1000; // bigger page size for export
//       let exportPage = 1;
//       let hasMore = true;
//
//       while (hasMore && collected.length < exportCount) {
//         const params = buildFilterParams();
//         params.set("page", String(exportPage));
//         params.set("page_size", String(pageSizeExport));
//
//         const url = `${API_BASE_URL}/contacts/?${params.toString()}`;
//         const res = await fetch(url);
//
//         if (!res.ok) {
//           const text = await res.text();
//           console.error("Export fetch failed", res.status, text);
//           alert("Export failed from server. Check backend logs.");
//           return;
//         }
//
//         const data: PaginatedResponse<Contact> = await res.json();
//         const pageResults = data.results || [];
//
//         for (const c of pageResults) {
//           if (collected.length >= exportCount) break;
//
//           const companyKey = (c.company_name || "Unknown").trim() || "Unknown";
//
//           if (limitPerCompany) {
//             const used = companyCounts[companyKey] || 0;
//             if (used >= maxPerCompany) continue;
//             companyCounts[companyKey] = used + 1;
//           }
//
//           collected.push(c);
//         }
//
//         if (!data.next || pageResults.length === 0) {
//           hasMore = false;
//         } else {
//           exportPage += 1;
//         }
//       }
//
//       if (collected.length === 0) {
//         alert("No contacts found to export");
//         return;
//       }
//
//       // build CSV
//       const rows: string[] = [];
//       const headerCols: string[] = ["Name", "Job Title", "Company"];
//
//       if (withEmail) headerCols.push("Email");
//       if (withPhone) headerCols.push("Phone");
//
//       rows.push(headerCols.join(","));
//
//       const escape = (value: string | null | undefined) => {
//         if (!value) return "";
//         const v = String(value).replace(/"/g, '""');
//         if (v.includes(",") || v.includes("\n")) {
//           return `"${v}"`;
//         }
//         return v;
//       };
//
//       collected.forEach((c) => {
//         const name =
//           c.full_name ||
//           `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//           "";
//         const email = c.official_email || c.email || "";
//         const phone = (c.phone_number || c.phone || "") as string;
//
//         const cols: string[] = [
//           escape(name),
//           escape(c.job_title),
//           escape(c.company_name),
//         ];
//
//         if (withEmail) cols.push(escape(email));
//         if (withPhone) cols.push(escape(phone));
//
//         rows.push(cols.join(","));
//       });
//
//       const csv = rows.join("\n");
//       const blob = new Blob([csv], {
//         type: "text/csv;charset=utf-8;",
//       });
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = downloadUrl;
//       a.download = `contacts_export_${new Date().getTime()}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(downloadUrl);
//       document.body.removeChild(a);
//
//       closeExportModal();
//       alert(`Successfully exported ${collected.length} contacts`);
//     } catch (err) {
//       console.error("Export error:", err);
//       alert("Export failed. Please try again.");
//     }
//   };
//
//   async function fetchContacts() {
//     try {
//       setLoading(true);
//       setError(null);
//
//       const params = buildFilterParams();
//       params.set("page", String(page));
//       params.set("page_size", String(pageSize));
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
//   useEffect(() => {
//     fetchContacts();
//   }, [
//     page,
//     currentCompany,
//     companyHeadcount,
//     pastCompany,
//     companyType,
//     companyHqLocation,
//     followingYourCompany,
//     viewedProfileRecently,
//     connectionFilter,
//     connectionsOf,
//     pastColleague,
//     sharedExperiences,
//     changedJobs,
//     postedOnLinkedIn,
//     functionFilter,
//     currentJobTitle,
//     seniorityLevel,
//     pastJobTitle,
//     yearsInCurrentCompany,
//     yearsInCurrentPosition,
//     geography,
//     industry,
//   ]);
//
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setPage(1);
//       fetchContacts();
//     }, 400);
//     return () => clearTimeout(id);
//   }, [search]);
//
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));
//
//   function clearFilters() {
//     setCurrentCompany("");
//     setCompanyHeadcount([]);
//     setPastCompany("");
//     setCompanyType([]);
//     setCompanyHqLocation("");
//     setFollowingYourCompany(false);
//     setViewedProfileRecently(false);
//     setConnectionFilter(false);
//     setConnectionsOf("");
//     setPastColleague(false);
//     setSharedExperiences(false);
//     setChangedJobs(false);
//     setPostedOnLinkedIn(false);
//     setFunctionFilter([]);
//     setCurrentJobTitle("");
//     setSeniorityLevel([]);
//     setPastJobTitle("");
//     setYearsInCurrentCompany("");
//     setYearsInCurrentPosition("");
//     setGeography("");
//     setIndustry([]);
//     setPage(1);
//   }
//
//   const hasActiveFilters =
//     currentCompany ||
//     companyHeadcount.length > 0 ||
//     pastCompany ||
//     companyType.length > 0 ||
//     companyHqLocation ||
//     followingYourCompany ||
//     viewedProfileRecently ||
//     connectionFilter ||
//     connectionsOf ||
//     pastColleague ||
//     sharedExperiences ||
//     changedJobs ||
//     postedOnLinkedIn ||
//     functionFilter.length > 0 ||
//     currentJobTitle ||
//     seniorityLevel.length > 0 ||
//     pastJobTitle ||
//     yearsInCurrentCompany ||
//     yearsInCurrentPosition ||
//     geography ||
//     industry.length > 0;
//
//   const FilterLabel = ({
//     text,
//     hasInfo = false,
//   }: {
//     text: string;
//     hasInfo?: boolean;
//   }) => (
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <span>{text}</span>
//       {hasInfo && <Info size={14} style={{ color: "#9ca3af" }} />}
//     </div>
//   );
//
//   const ToggleSwitch = ({
//     checked,
//     onChange,
//   }: {
//     checked: boolean;
//     onChange: () => void;
//   }) => (
//     <div
//       onClick={onChange}
//       style={{
//         width: 40,
//         height: 20,
//         borderRadius: 10,
//         background: checked ? "#0a66c2" : "#d1d5db",
//         position: "relative",
//         cursor: "pointer",
//         transition: "background 0.2s",
//       }}
//     >
//       <div
//         style={{
//           width: 16,
//           height: 16,
//           borderRadius: "50%",
//           background: "#fff",
//           position: "absolute",
//           top: 2,
//           left: checked ? 22 : 2,
//           transition: "left 0.2s",
//         }}
//       />
//     </div>
//   );
//
//   const selectionSummary = (() => {
//     if (selectionMode === "this_page") {
//       return `This page (${contacts.length})`;
//     }
//     if (selectionMode === "all") {
//       return `All filtered (${total})`;
//     }
//     return `Number of people: ${selectNumber}`;
//   })();
//
//   const currentPageCount = contacts.length;
//
//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         fontFamily: "system-ui, -apple-system, sans-serif",
//       }}
//     >
//       {/* LEFT SIDEBAR */}
//       <aside
//         style={{
//           width: 320,
//           borderRight: "1px solid #e5e7eb",
//           background: "#fff",
//           overflowY: "auto",
//         }}
//       >
//         <div
//           style={{ padding: "20px 16px", borderBottom: "1px solid #e5e7eb" }}
//         >
//           <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
//             Find people
//           </h1>
//         </div>
//
//         {hasActiveFilters && (
//           <div
//             style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}
//           >
//             <button
//               onClick={clearFilters}
//               style={{
//                 fontSize: 13,
//                 color: "#0a66c2",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 fontWeight: 500,
//               }}
//             >
//               Clear all
//             </button>
//           </div>
//         )}
//
//         {/* COMPANY SECTION */}
//         <div style={{ borderBottom: "1px solid #e5e7eb" }}>
//           <button
//             onClick={() => toggleFilterSection("company")}
//             style={{
//               width: "100%",
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: 14,
//               fontWeight: 600,
//             }}
//           >
//             <span>Company</span>
//             {filterSections.company ? (
//               <ChevronUp size={18} />
//             ) : (
//               <ChevronDown size={18} />
//             )}
//           </button>
//           {filterSections.company && (
//             <div style={{ padding: "0 16px 16px" }}>
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Current company" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={currentCompany}
//                   onChange={(e) => setCurrentCompany(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: 4,
//                     border: "1px solid #d1d5db",
//                     fontSize: 13,
//                   }}
//                 />
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Company headcount" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 {["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"].map(
//                   (size) => (
//                     <label
//                       key={size}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "6px 0",
//                         cursor: "pointer",
//                         fontSize: 13,
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={companyHeadcount.includes(size)}
//                         onChange={() =>
//                           toggleArrayFilter(
//                             companyHeadcount,
//                             setCompanyHeadcount,
//                             size
//                           )
//                         }
//                         style={{ marginRight: 8, width: 14, height: 14 }}
//                       />
//                       {size}
//                     </label>
//                   )
//                 )}
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Past company" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={pastCompany}
//                   onChange={(e) => setPastCompany(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: 4,
//                     border: "1px solid #d1d5db",
//                     fontSize: 13,
//                   }}
//                 />
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Company type" />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 {[
//                   "Public Company",
//                   "Privately Held",
//                   "Non-Profit",
//                   "Educational Institution",
//                   "Partnership",
//                   "Self-Employed",
//                 ].map((type) => (
//                   <label
//                     key={type}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       padding: "6px 0",
//                       cursor: "pointer",
//                       fontSize: 13,
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={companyType.includes(type)}
//                       onChange={() =>
//                         toggleArrayFilter(companyType, setCompanyType, type)
//                       }
//                       style={{ marginRight: 8, width: 14, height: 14 }}
//                     />
//                     {type}
//                   </label>
//                 ))}
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Company headquarters location" />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search location"
//                   value={companyHqLocation}
//                   onChange={(e) => setCompanyHqLocation(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: 4,
//                     border: "1px solid #d1d5db",
//                     fontSize: 13,
//                   }}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//
//         {/* BUYER INTENT */}
//         <div style={{ borderBottom: "1px solid #e5e7eb" }}>
//           <button
//             onClick={() => toggleFilterSection("buyerIntent")}
//             style={{
//               width: "100%",
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: 14,
//               fontWeight: 600,
//             }}
//           >
//             <FilterLabel text="Buyer intent" hasInfo />
//             {filterSections.buyerIntent ? (
//               <ChevronUp size={18} />
//             ) : (
//               <ChevronDown size={18} />
//             )}
//           </button>
//           {filterSections.buyerIntent && (
//             <div style={{ padding: "0 16px 16px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "8px 0",
//                 }}
//               >
//                 <span style={{ fontSize: 13 }}>Following your company</span>
//                 <ToggleSwitch
//                   checked={followingYourCompany}
//                   onChange={() =>
//                     setFollowingYourCompany(!followingYourCompany)
//                   }
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "8px 0",
//                 }}
//               >
//                 <span style={{ fontSize: 13 }}>Viewed your profile recently</span>
//                 <ToggleSwitch
//                   checked={viewedProfileRecently}
//                   onChange={() =>
//                     setViewedProfileRecently(!viewedProfileRecently)
//                   }
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//
//         {/* ROLE */}
//         <div style={{ borderBottom: "1px solid #e5e7eb" }}>
//           <button
//             onClick={() => toggleFilterSection("role")}
//             style={{
//               width: "100%",
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: 14,
//               fontWeight: 600,
//             }}
//           >
//             <span>Role</span>
//             {filterSections.role ? (
//               <ChevronUp size={18} />
//             ) : (
//               <ChevronDown size={18} />
//             )}
//           </button>
//           {filterSections.role && (
//             <div style={{ padding: "0 16px 16px" }}>
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Function" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 {["Sales", "Marketing", "Engineering", "Operations", "Finance", "HR"].map(
//                   (func) => (
//                     <label
//                       key={func}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "6px 0",
//                         cursor: "pointer",
//                         fontSize: 13,
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={functionFilter.includes(func)}
//                         onChange={() =>
//                           toggleArrayFilter(
//                             functionFilter,
//                             setFunctionFilter,
//                             func
//                           )
//                         }
//                         style={{ marginRight: 8, width: 14, height: 14 }}
//                       />
//                       {func}
//                     </label>
//                   )
//                 )}
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Current job title" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search job title"
//                   value={currentJobTitle}
//                   onChange={(e) => setCurrentJobTitle(e.target.value)}
//                   style={{
//                     width: "100%",
//                     padding: "6px 10px",
//                     borderRadius: 4,
//                     border: "1px solid #d1d5db",
//                     fontSize: 13,
//                   }}
//                 />
//               </div>
//
//               <div style={{ marginBottom: 12 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 4,
//                     marginBottom: 6,
//                     fontSize: 13,
//                     color: "#374151",
//                   }}
//                 >
//                   <FilterLabel text="Seniority level" hasInfo />
//                   <Plus
//                     size={14}
//                     style={{ marginLeft: "auto", color: "#6b7280" }}
//                   />
//                 </div>
//                 {["Entry", "Senior", "Manager", "Director", "VP", "C-Level"].map(
//                   (level) => (
//                     <label
//                       key={level}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "6px 0",
//                         cursor: "pointer",
//                         fontSize: 13,
//                       }}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={seniorityLevel.includes(level)}
//                         onChange={() =>
//                           toggleArrayFilter(
//                             seniorityLevel,
//                             setSeniorityLevel,
//                             level
//                           )
//                         }
//                         style={{ marginRight: 8, width: 14, height: 14 }}
//                       />
//                       {level}
//                     </label>
//                   )
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>
//
//       {/* MAIN CONTENT */}
//       <main
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           background: "#f9fafb",
//         }}
//       >
//         {/* Top bar */}
//         <div
//           style={{
//             padding: "16px 24px",
//             borderBottom: "1px solid #e5e7eb",
//             display: "flex",
//             alignItems: "center",
//             gap: 16,
//             background: "#fff",
//           }}
//         >
//           <div style={{ flex: 1 }}>
//             <h1
//               style={{
//                 fontSize: 24,
//                 fontWeight: 600,
//                 margin: 0,
//                 marginBottom: 4,
//               }}
//             >
//               Find people
//             </h1>
//             <div style={{ fontSize: 13, color: "#6b7280" }}>
//               {loading
//                 ? "Loading..."
//                 : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
//             </div>
//           </div>
//           <div style={{ flex: 2, maxWidth: 500, position: "relative" }}>
//             <Search
//               style={{
//                 position: "absolute",
//                 left: 14,
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#9ca3af",
//               }}
//               size={18}
//             />
//             <input
//               type="text"
//               placeholder="Search people"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "10px 14px 10px 44px",
//                 borderRadius: 8,
//                 border: "1px solid #d1d5db",
//                 fontSize: 14,
//               }}
//             />
//           </div>
//
//           {/* Profile Button */}
//           <div style={{ position: "relative" }} ref={profileMenuRef}>
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: "50%",
//                 background: "#e5e7eb",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#374151",
//                 fontWeight: 600,
//                 fontSize: 14,
//               }}
//             >
//               JM
//             </button>
//
//             {showProfileMenu && (
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 50,
//                   right: 0,
//                   width: 260,
//                   background: "#fff",
//                   border: "1px solid #e5e7eb",
//                   borderRadius: 8,
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                   zIndex: 50,
//                 }}
//               >
//                 <div
//                   style={{
//                     padding: "12px 16px",
//                     borderBottom: "1px solid #e5e7eb",
//                   }}
//                 >
//                   <div
//                     style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}
//                   >
//                     JM
//                   </div>
//                   <div style={{ fontSize: 12, color: "#6b7280" }}>
//                     user@example.com
//                   </div>
//                 </div>
//
//                 <div style={{ padding: "4px 0" }}>
//                   <button style={menuItemStyle}>
//                     <User size={16} />
//                     <span>Your profile</span>
//                   </button>
//                   <button style={menuItemStyle}>
//                     <Bell size={16} />
//                     <span>Activity & notifications</span>
//                   </button>
//                   <button style={menuItemStyle}>
//                     <Palette size={16} />
//                     <span>Theme</span>
//                   </button>
//                   <button style={menuItemStyle}>
//                     <Globe size={16} />
//                     <span>Language</span>
//                     <span
//                       style={{
//                         marginLeft: "auto",
//                         fontSize: 10,
//                         background: "#dbeafe",
//                         color: "#1e40af",
//                         padding: "2px 6px",
//                         borderRadius: 4,
//                         fontWeight: 500,
//                       }}
//                     >
//                       Beta
//                     </span>
//                   </button>
//                   <button style={menuItemStyle}>
//                     <CreditCard size={16} />
//                     <span>View credit usage</span>
//                   </button>
//                 </div>
//
//                 <div
//                   style={{
//                     borderTop: "1px solid #e5e7eb",
//                     padding: "4px 0",
//                   }}
//                 >
//                   <button style={menuItemStyle}>
//                     <Smartphone size={16} />
//                     <span>Access Mobile</span>
//                   </button>
//                   <button style={menuItemStyle}>
//                     <LogOut size={16} />
//                     <span>Log out</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//
//         {error && (
//           <div
//             style={{
//               margin: "16px 24px 0",
//               padding: 12,
//               borderRadius: 8,
//               background: "#fee2e2",
//               color: "#991b1b",
//               fontSize: 14,
//             }}
//           >
//             {error}
//           </div>
//         )}
//
//         {/* TABLE */}
//         <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
//           <div
//             style={{
//               border: "1px solid #e5e7eb",
//               borderRadius: 8,
//               overflow: "hidden",
//               background: "#fff",
//             }}
//           >
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: 14,
//               }}
//             >
//               <thead
//                 style={{
//                   background: "#f9fafb",
//                   borderBottom: "2px solid #e5e7eb",
//                 }}
//               >
//                 <tr>
//                   <th
//                     style={{
//                       padding: "12px 16px",
//                       textAlign: "left",
//                       fontWeight: 600,
//                       color: "#374151",
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={headerChecked}
//                       onChange={handleHeaderCheckboxChange}
//                     />
//                   </th>
//                   <th style={thCell}>Name</th>
//                   <th style={thCell}>Job Title</th>
//                   <th style={thCell}>Company</th>
//                   <th style={thCell}>Email</th>
//                   <th style={thCell}>Status</th>
//                   <th style={thCell}>Location</th>
//                   <th style={thCell}>Sales Nav</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {contacts.length === 0 && !loading && (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       style={{
//                         padding: 48,
//                         textAlign: "center",
//                         color: "#6b7280",
//                       }}
//                     >
//                       No contacts found.
//                     </td>
//                   </tr>
//                 )}
//
//                 {contacts.map((c, index) => {
//                   const name =
//                     c.full_name ||
//                     `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
//                     "—";
//                   const email = c.official_email || c.email || "—";
//                   const rowKey = c.contact_id ?? `${email}-${index}`;
//
//                   return (
//                     <tr
//                       key={rowKey}
//                       style={{
//                         borderBottom: "1px solid #f3f4f6",
//                         cursor: "pointer",
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.background = "#f9fafb")
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.background = "#fff")
//                       }
//                     >
//                       <td style={{ padding: "12px 16px" }}>
//                         <input type="checkbox" checked={headerChecked} readOnly />
//                       </td>
//                       <td
//                         style={{
//                           padding: "12px 16px",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {name}
//                       </td>
//                       <td style={tdCell}>{c.job_title || "—"}</td>
//                       <td style={tdCell}>{c.company_name || "—"}</td>
//                       <td
//                         style={{
//                           padding: "12px 16px",
//                           color: "#2563eb",
//                         }}
//                       >
//                         {email}
//                       </td>
//                       <td style={{ padding: "12px 16px" }}>
//                         {c.status ? (
//                           <span
//                             style={{
//                               padding: "4px 10px",
//                               borderRadius: 999,
//                               fontSize: 12,
//                               fontWeight: 500,
//                               background:
//                                 c.status === "Working"
//                                   ? "#dcfce7"
//                                   : c.status === "Contacted"
//                                   ? "#dbeafe"
//                                   : c.status === "New"
//                                   ? "#fae8ff"
//                                   : "#fef3c7",
//                               color:
//                                 c.status === "Working"
//                                   ? "#166534"
//                                   : c.status === "Contacted"
//                                   ? "#1e40af"
//                                   : c.status === "New"
//                                   ? "#86198f"
//                                   : "#92400e",
//                             }}
//                           >
//                             {c.status}
//                           </span>
//                         ) : (
//                           "—"
//                         )}
//                       </td>
//                       <td style={tdCell}>{c.location || "—"}</td>
//                       <td style={tdCell}>
//                         {c.sales_nav_profile_url ? (
//                           <a
//                             href={c.sales_nav_profile_url}
//                             target="_blank"
//                             rel="noreferrer"
//                             style={{
//                               color: "#2563eb",
//                               textDecoration: "none",
//                               fontWeight: 500,
//                             }}
//                           >
//                             Open
//                           </a>
//                         ) : (
//                           "—"
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//
//         {/* PAGINATION */}
//         <div
//           style={{
//             padding: "12px 24px",
//             borderTop: "1px solid #e5e7eb",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             background: "#fff",
//           }}
//         >
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page <= 1 || loading}
//             style={{
//               padding: "8px 16px",
//               borderRadius: 6,
//               border: "1px solid #d1d5db",
//               background: page <= 1 || loading ? "#f3f4f6" : "#fff",
//               cursor: page <= 1 || loading ? "not-allowed" : "pointer",
//               fontSize: 14,
//               fontWeight: 500,
//             }}
//           >
//             Previous
//           </button>
//           <span style={{ fontSize: 14, color: "#6b7280" }}>
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
//             disabled={page >= totalPages || loading}
//             style={{
//               padding: "8px 16px",
//               borderRadius: 6,
//               border: "1px solid #d1d5db",
//               background: page >= totalPages || loading ? "#f3f4f6" : "#fff",
//               cursor: page >= totalPages || loading ? "not-allowed" : "pointer",
//               fontSize: 14,
//               fontWeight: 500,
//             }}
//           >
//             Next
//           </button>
//         </div>
//       </main>
//
//       {/* SELECTION MODAL */}
//       {showSelectionModal && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <h2
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 margin: 0,
//                 marginBottom: 12,
//               }}
//             >
//               Select contacts
//             </h2>
//
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: 8,
//                 fontSize: 14,
//               }}
//             >
//               <input
//                 type="radio"
//                 name="selection-mode"
//                 checked={selectionMode === "number"}
//                 onChange={() => setSelectionMode("number")}
//                 style={{ marginRight: 8 }}
//               />
//               <span>Select number of people</span>
//             </label>
//             <div
//               style={{
//                 marginLeft: 26,
//                 marginBottom: 12,
//                 display: "flex",
//                 gap: 8,
//                 alignItems: "center",
//               }}
//             >
//               <input
//                 type="number"
//                 min={1}
//                 max={total || undefined}
//                 value={selectNumber}
//                 onChange={(e) =>
//                   setSelectNumber(Math.max(1, Number(e.target.value) || 1))
//                 }
//                 style={{
//                   width: 80,
//                   padding: "6px 8px",
//                   borderRadius: 4,
//                   border: "1px solid #d1d5db",
//                   fontSize: 14,
//                 }}
//               />
//             </div>
//
//             <div
//               style={{
//                 marginLeft: 26,
//                 marginBottom: 16,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={limitPerCompany}
//                 onChange={() => setLimitPerCompany(!limitPerCompany)}
//               />
//               <span style={{ fontSize: 14 }}>Max people per company</span>
//               <input
//                 type="number"
//                 min={1}
//                 value={maxPerCompany}
//                 onChange={(e) =>
//                   setMaxPerCompany(Math.max(1, Number(e.target.value) || 1))
//                 }
//                 style={{
//                   width: 60,
//                   padding: "6px 8px",
//                   borderRadius: 4,
//                   border: "1px solid #d1d5db",
//                   fontSize: 14,
//                   marginLeft: 8,
//                 }}
//               />
//             </div>
//
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: 8,
//                 fontSize: 14,
//               }}
//             >
//               <input
//                 type="radio"
//                 name="selection-mode"
//                 checked={selectionMode === "this_page"}
//                 onChange={() => setSelectionMode("this_page")}
//                 style={{ marginRight: 8 }}
//               />
//               <span>Select this page ({currentPageCount})</span>
//             </label>
//
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 marginBottom: 16,
//                 fontSize: 14,
//               }}
//             >
//               <input
//                 type="radio"
//                 name="selection-mode"
//                 checked={selectionMode === "all"}
//                 onChange={() => setSelectionMode("all")}
//                 style={{ marginRight: 8 }}
//               />
//               <span>Select all ({total})</span>
//             </label>
//
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 gap: 8,
//                 marginTop: 8,
//               }}
//             >
//               <button
//                 onClick={closeSelectionModal}
//                 style={{
//                   padding: "8px 14px",
//                   borderRadius: 6,
//                   border: "1px solid #d1d5db",
//                   background: "#fff",
//                   cursor: "pointer",
//                   fontSize: 14,
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={applySelection}
//                 style={{
//                   padding: "8px 14px",
//                   borderRadius: 6,
//                   border: "none",
//                   background: "#facc15",
//                   cursor: "pointer",
//                   fontSize: 14,
//                   fontWeight: 600,
//                 }}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//
//       {/* EXPORT MODAL */}
//       {showExportModal && (
//         <div style={overlayStyle}>
//           <div style={modalStyle}>
//             <h2
//               style={{
//                 fontSize: 16,
//                 fontWeight: 600,
//                 margin: 0,
//                 marginBottom: 12,
//               }}
//             >
//               Export data
//             </h2>
//             <p
//               style={{
//                 margin: 0,
//                 marginBottom: 16,
//                 fontSize: 14,
//                 color: "#4b5563",
//               }}
//             >
//               {selectionSummary}
//             </p>
//
//             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//               <button
//                 onClick={() => exportData(true, false)}
//                 style={exportButtonStyle}
//               >
//                 Export with email
//               </button>
//               <button
//                 onClick={() => exportData(false, true)}
//                 style={exportButtonStyle}
//               >
//                 Export with phone
//               </button>
//               <button
//                 onClick={() => exportData(true, true)}
//                 style={exportButtonStyle}
//               >
//                 Export with email & phone
//               </button>
//             </div>
//
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginTop: 16,
//               }}
//             >
//               <button
//                 onClick={closeExportModal}
//                 style={{
//                   padding: "8px 14px",
//                   borderRadius: 6,
//                   border: "1px solid #d1d5db",
//                   background: "#fff",
//                   cursor: "pointer",
//                   fontSize: 14,
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Info,
  User,
  Bell,
  Palette,
  Globe,
  CreditCard,
  LogOut,
  Smartphone,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Contact = {
  contact_id: number | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  duration: string | null;
  status: string | null;
  email_status: string | null;
  official_email: string | null;
  email: string | null;
  connection_degree: string | null;
  sales_nav_profile_url: string | null;
  phone?: string | null;
  phone_number?: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type SelectionMode = "number" | "this_page" | "all" | null;

const thCell: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: 600,
  color: "#374151",
  whiteSpace: "nowrap",
};

const tdCell: React.CSSProperties = {
  padding: "12px 16px",
  color: "#6b7280",
};

const menuItemStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 16px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  color: "#374151",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const modalStyle: React.CSSProperties = {
  width: 380,
  maxWidth: "90vw",
  background: "#fff",
  borderRadius: 12,
  padding: 20,
  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
};

const exportButtonStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
  fontSize: 14,
  textAlign: "left",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // selection / export
  const [headerChecked, setHeaderChecked] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("number");
  const [selectNumber, setSelectNumber] = useState(25);
  const [limitPerCompany, setLimitPerCompany] = useState(true);
  const [maxPerCompany, setMaxPerCompany] = useState(2);
  const [showExportModal, setShowExportModal] = useState(false);

  // Company Filters
  const [currentCompany, setCurrentCompany] = useState<string>("");
  const [companyHeadcount, setCompanyHeadcount] = useState<string[]>([]);
  const [pastCompany, setPastCompany] = useState<string>("");
  const [companyType, setCompanyType] = useState<string[]>([]);
  const [companyHqLocation, setCompanyHqLocation] = useState<string>("");

  // Buyer Intent Filters
  const [followingYourCompany, setFollowingYourCompany] = useState(false);
  const [viewedProfileRecently, setViewedProfileRecently] = useState(false);

  // Best Path Filters
  const [connectionFilter, setConnectionFilter] = useState(false);
  const [connectionsOf, setConnectionsOf] = useState<string>("");
  const [pastColleague, setPastColleague] = useState(false);
  const [sharedExperiences, setSharedExperiences] = useState(false);

  // Recent Updates Filters
  const [changedJobs, setChangedJobs] = useState(false);
  const [postedOnLinkedIn, setPostedOnLinkedIn] = useState(false);

  // Role Filters
  const [functionFilter, setFunctionFilter] = useState<string[]>([]);
  const [currentJobTitle, setCurrentJobTitle] = useState<string>("");
  const [seniorityLevel, setSeniorityLevel] = useState<string[]>([]);
  const [pastJobTitle, setPastJobTitle] = useState<string>("");
  const [yearsInCurrentCompany, setYearsInCurrentCompany] =
    useState<string>("");
  const [yearsInCurrentPosition, setYearsInCurrentPosition] =
    useState<string>("");

  // Personal Filters
  const [geography, setGeography] = useState<string>("");
  const [industry, setIndustry] = useState<string[]>([]);

  const [filterSections, setFilterSections] = useState({
    company: true,
    buyerIntent: false,
    bestPath: false,
    recentUpdates: false,
    role: false,
    personal: false,
  });

  // close profile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // build URLSearchParams for all active filters
  const buildFilterParams = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (currentCompany.trim())
      params.set("company_name", currentCompany.trim());
    if (companyHeadcount.length > 0)
      params.set("company_headcount", companyHeadcount[0]);
    if (pastCompany.trim()) params.set("past_company", pastCompany.trim());
    if (companyType.length > 0) params.set("company_type", companyType.join(","));
    if (companyHqLocation.trim())
      params.set("location", companyHqLocation.trim());
    if (followingYourCompany) params.set("following_company", "true");
    if (viewedProfileRecently) params.set("viewed_profile", "true");
    if (connectionFilter) params.set("connection_1st", "true");
    if (connectionsOf.trim()) params.set("connections_of", connectionsOf);
    if (pastColleague) params.set("past_colleague", "true");
    if (sharedExperiences) params.set("shared_experiences", "true");
    if (changedJobs) params.set("changed_jobs", "true");
    if (postedOnLinkedIn) params.set("posted_linkedin", "true");
    if (functionFilter.length > 0)
      params.set("function", functionFilter.join(","));
    if (currentJobTitle.trim())
      params.set("job_title", currentJobTitle.trim());
    if (seniorityLevel.length > 0)
      params.set("seniority", seniorityLevel.join(","));
    if (pastJobTitle.trim())
      params.set("past_job_title", pastJobTitle.trim());
    if (yearsInCurrentCompany)
      params.set("years_current_company", yearsInCurrentCompany);
    if (yearsInCurrentPosition)
      params.set("years_current_position", yearsInCurrentPosition);
    if (geography.trim()) params.set("location", geography.trim());
    if (industry.length > 0) params.set("industry", industry.join(","));

    return params;
  };

  const handleHeaderCheckboxChange = () => {
    setSelectionMode("number");
    setShowSelectionModal(true);
  };

  const closeSelectionModal = () => {
    setShowSelectionModal(false);
    if (!showExportModal) setHeaderChecked(false);
  };

  const applySelection = () => {
    setShowSelectionModal(false);
    setHeaderChecked(true);
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
    setHeaderChecked(false);
  };

  const exportData = async (withEmail: boolean, withPhone: boolean) => {
    try {
      let exportCount = 0;

      if (selectionMode === "number") {
        exportCount = selectNumber;
      } else if (selectionMode === "this_page") {
        exportCount = contacts.length;
      } else if (selectionMode === "all") {
        exportCount = total;
      }

      if (exportCount <= 0) {
        alert("Nothing to export");
        return;
      }

      const collected: Contact[] = [];
      const companyCounts: Record<string, number> = {};
      const pageSizeExport = 1000;
      let exportPage = 1;
      let hasMore = true;

      while (hasMore && collected.length < exportCount) {
        const params = buildFilterParams();
        params.set("page", String(exportPage));
        params.set("page_size", String(pageSizeExport));

        const url = `${API_BASE_URL}/contacts/?${params.toString()}`;
        const res = await fetch(url);

        if (!res.ok) {
          alert("Export failed from server. Check backend logs.");
          return;
        }

        const data: PaginatedResponse<Contact> = await res.json();
        const pageResults = data.results || [];

        for (const c of pageResults) {
          if (collected.length >= exportCount) break;

          const companyKey = (c.company_name || "Unknown").trim() || "Unknown";

          if (limitPerCompany) {
            const used = companyCounts[companyKey] || 0;
            if (used >= maxPerCompany) continue;
            companyCounts[companyKey] = used + 1;
          }

          collected.push(c);
        }

        if (!data.next || pageResults.length === 0) {
          hasMore = false;
        } else {
          exportPage += 1;
        }
      }

      if (collected.length === 0) {
        alert("No contacts found to export");
        return;
      }

      const rows: string[] = [];
      const headerCols: string[] = ["Name", "Job Title", "Company"];

      if (withEmail) headerCols.push("Email");
      if (withPhone) headerCols.push("Phone");

      rows.push(headerCols.join(","));

      const escape = (value: string | null | undefined) => {
        if (!value) return "";
        const v = String(value).replace(/"/g, '""');
        if (v.includes(",") || v.includes("\n")) {
          return `"${v}"`;
        }
        return v;
      };

      collected.forEach((c) => {
        const name =
          c.full_name ||
          `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
          "";
        const email = c.official_email || c.email || "";
        const phone = (c.phone_number || c.phone || "") as string;

        const cols: string[] = [
          escape(name),
          escape(c.job_title),
          escape(c.company_name),
        ];

        if (withEmail) cols.push(escape(email));
        if (withPhone) cols.push(escape(phone));

        rows.push(cols.join(","));
      });

      const csv = rows.join("\n");
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `contacts_export_${new Date().getTime()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      closeExportModal();
      alert(`Successfully exported ${collected.length} contacts`);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    }
  };

  async function fetchContacts() {
    try {
      setLoading(true);
      setError(null);

      const params = buildFilterParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

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

  useEffect(() => {
    fetchContacts();
  }, [
    page,
    currentCompany,
    companyHeadcount,
    pastCompany,
    companyType,
    companyHqLocation,
    followingYourCompany,
    viewedProfileRecently,
    connectionFilter,
    connectionsOf,
    pastColleague,
    sharedExperiences,
    changedJobs,
    postedOnLinkedIn,
    functionFilter,
    currentJobTitle,
    seniorityLevel,
    pastJobTitle,
    yearsInCurrentCompany,
    yearsInCurrentPosition,
    geography,
    industry,
  ]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchContacts();
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function clearFilters() {
    setCurrentCompany("");
    setCompanyHeadcount([]);
    setPastCompany("");
    setCompanyType([]);
    setCompanyHqLocation("");
    setFollowingYourCompany(false);
    setViewedProfileRecently(false);
    setConnectionFilter(false);
    setConnectionsOf("");
    setPastColleague(false);
    setSharedExperiences(false);
    setChangedJobs(false);
    setPostedOnLinkedIn(false);
    setFunctionFilter([]);
    setCurrentJobTitle("");
    setSeniorityLevel([]);
    setPastJobTitle("");
    setYearsInCurrentCompany("");
    setYearsInCurrentPosition("");
    setGeography("");
    setIndustry([]);
    setPage(1);
  }

  const hasActiveFilters =
    currentCompany ||
    companyHeadcount.length > 0 ||
    pastCompany ||
    companyType.length > 0 ||
    companyHqLocation ||
    followingYourCompany ||
    viewedProfileRecently ||
    connectionFilter ||
    connectionsOf ||
    pastColleague ||
    sharedExperiences ||
    changedJobs ||
    postedOnLinkedIn ||
    functionFilter.length > 0 ||
    currentJobTitle ||
    seniorityLevel.length > 0 ||
    pastJobTitle ||
    yearsInCurrentCompany ||
    yearsInCurrentPosition ||
    geography ||
    industry.length > 0;

  const FilterLabel = ({
    text,
    hasInfo = false,
  }: {
    text: string;
    hasInfo?: boolean;
  }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span>{text}</span>
      {hasInfo && <Info size={14} style={{ color: "#9ca3af" }} />}
    </div>
  );

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
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

  const selectionSummary = (() => {
    if (selectionMode === "this_page") {
      return `This page (${contacts.length})`;
    }
    if (selectionMode === "all") {
      return `All filtered (${total})`;
    }
    return `Number of people: ${selectNumber}`;
  })();

  const currentPageCount = contacts.length;

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* LEFT SIDEBAR */}
      <aside
        style={{
          width: 320,
          borderRight: "1px solid #e5e7eb",
          background: "#fff",
          overflowY: "auto",
        }}
      >
        <div
          style={{ padding: "20px 16px", borderBottom: "1px solid #e5e7eb" }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
            Find people
          </h1>
        </div>

        {hasActiveFilters && (
          <div
            style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}
          >
            <button
              onClick={clearFilters}
              style={{
                fontSize: 13,
                color: "#0a66c2",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear all
            </button>
          </div>
        )}

        {/* COMPANY SECTION */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => toggleFilterSection("company")}
            style={{
              width: "100%",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>Company</span>
            {filterSections.company ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {filterSections.company && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Current company" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Company headcount" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                {["1-10", "11-50", "51-200", "201-500", "501-1000", "1001+"].map(
                  (size) => (
                    <label
                      key={size}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={companyHeadcount.includes(size)}
                        onChange={() =>
                          toggleArrayFilter(
                            companyHeadcount,
                            setCompanyHeadcount,
                            size
                          )
                        }
                        style={{ marginRight: 8, width: 14, height: 14 }}
                      />
                      {size}
                    </label>
                  )
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Past company" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={pastCompany}
                  onChange={(e) => setPastCompany(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Company type" />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                {[
                  "Public Company",
                  "Privately Held",
                  "Non-Profit",
                  "Educational Institution",
                  "Partnership",
                  "Self-Employed",
                ].map((type) => (
                  <label
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "6px 0",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={companyType.includes(type)}
                      onChange={() =>
                        toggleArrayFilter(companyType, setCompanyType, type)
                      }
                      style={{ marginRight: 8, width: 14, height: 14 }}
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Company headquarters location" />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search location"
                  value={companyHqLocation}
                  onChange={(e) => setCompanyHqLocation(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* BUYER INTENT */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => toggleFilterSection("buyerIntent")}
            style={{
              width: "100%",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <FilterLabel text="Buyer intent" hasInfo />
            {filterSections.buyerIntent ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {filterSections.buyerIntent && (
            <div style={{ padding: "0 16px 16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <span style={{ fontSize: 13 }}>Following your company</span>
                <ToggleSwitch
                  checked={followingYourCompany}
                  onChange={() =>
                    setFollowingYourCompany(!followingYourCompany)
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <span style={{ fontSize: 13 }}>Viewed your profile recently</span>
                <ToggleSwitch
                  checked={viewedProfileRecently}
                  onChange={() =>
                    setViewedProfileRecently(!viewedProfileRecently)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* ROLE */}
        <div style={{ borderBottom: "1px solid #e5e7eb" }}>
          <button
            onClick={() => toggleFilterSection("role")}
            style={{
              width: "100%",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span>Role</span>
            {filterSections.role ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          {filterSections.role && (
            <div style={{ padding: "0 16px 16px" }}>
              {/* Function */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Function" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                {["Sales", "Marketing", "Engineering", "Operations", "Finance", "HR"].map(
                  (func) => (
                    <label
                      key={func}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={functionFilter.includes(func)}
                        onChange={() =>
                          toggleArrayFilter(
                            functionFilter,
                            setFunctionFilter,
                            func
                          )
                        }
                        style={{ marginRight: 8, width: 14, height: 14 }}
                      />
                      {func}
                    </label>
                  )
                )}
              </div>

              {/* Current Job Title */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Current job title" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search job title"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: 4,
                    border: "1px solid #d1d5db",
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Seniority Level */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#374151",
                  }}
                >
                  <FilterLabel text="Seniority level" hasInfo />
                  <Plus
                    size={14}
                    style={{ marginLeft: "auto", color: "#6b7280" }}
                  />
                </div>
                {["Entry", "Senior", "Manager", "Director", "VP", "C-Level"].map(
                  (level) => (
                    <label
                      key={level}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 0",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={seniorityLevel.includes(level)}
                        onChange={() =>
                          toggleArrayFilter(
                            seniorityLevel,
                            setSeniorityLevel,
                            level
                          )
                        }
                        style={{ marginRight: 8, width: 14, height: 14 }}
                      />
                      {level}
                    </label>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#f9fafb",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#fff",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 600,
                margin: 0,
                marginBottom: 4,
              }}
            >
              Find people
            </h1>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {loading
                ? "Loading..."
                : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
            </div>
          </div>
          <div style={{ flex: 2, maxWidth: 500, position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
              size={18}
            />
            <input
              type="text"
              placeholder="Search people"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 44px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
              }}
            />
          </div>

          {/* Profile Button */}
          <div style={{ position: "relative" }} ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#e5e7eb",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              JM
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: 50,
                  right: 0,
                  width: 260,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}
                  >
                    JM
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    user@example.com
                  </div>
                </div>

                <div style={{ padding: "4px 0" }}>
                  <button style={menuItemStyle}>
                    <User size={16} />
                    <span>Your profile</span>
                  </button>
                  <button style={menuItemStyle}>
                    <Bell size={16} />
                    <span>Activity & notifications</span>
                  </button>
                  <button style={menuItemStyle}>
                    <Palette size={16} />
                    <span>Theme</span>
                  </button>
                  <button style={menuItemStyle}>
                    <Globe size={16} />
                    <span>Language</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 500,
                      }}
                    >
                      Beta
                    </span>
                  </button>
                  <button style={menuItemStyle}>
                    <CreditCard size={16} />
                    <span>View credit usage</span>
                  </button>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    padding: "4px 0",
                  }}
                >
                  <button style={menuItemStyle}>
                    <Smartphone size={16} />
                    <span>Access Mobile</span>
                  </button>
                  <button style={menuItemStyle}>
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "16px 24px 0",
              padding: 12,
              borderRadius: 8,
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead
                style={{
                  background: "#f9fafb",
                  borderBottom: "2px solid #e5e7eb",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={headerChecked}
                      onChange={handleHeaderCheckboxChange}
                    />
                  </th>
                  <th style={thCell}>Name</th>
                  <th style={thCell}>Job Title</th>
                  <th style={thCell}>Company</th>
                  <th style={thCell}>Email</th>
                  <th style={thCell}>Status</th>
                  <th style={thCell}>Location</th>
                  <th style={thCell}>Sales Nav</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 48,
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      No contacts found.
                    </td>
                  </tr>
                )}

                {contacts.map((c, index) => {
                  const name =
                    c.full_name ||
                    `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                    "—";
                  const email = c.official_email || c.email || "—";
                  const rowKey = c.contact_id ?? `${email}-${index}`;

                  return (
                    <tr
                      key={rowKey}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <input type="checkbox" checked={headerChecked} readOnly />
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontWeight: 500,
                        }}
                      >
                        {name}
                      </td>
                      <td style={tdCell}>{c.job_title || "—"}</td>
                      <td style={tdCell}>{c.company_name || "—"}</td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#2563eb",
                        }}
                      >
                        {email}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {c.status ? (
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 500,
                              background:
                                c.status === "Working"
                                  ? "#dcfce7"
                                  : c.status === "Contacted"
                                  ? "#dbeafe"
                                  : c.status === "New"
                                  ? "#fae8ff"
                                  : "#fef3c7",
                              color:
                                c.status === "Working"
                                  ? "#166534"
                                  : c.status === "Contacted"
                                  ? "#1e40af"
                                  : c.status === "New"
                                  ? "#86198f"
                                  : "#92400e",
                            }}
                          >
                            {c.status}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={tdCell}>{c.location || "—"}</td>
                      <td style={tdCell}>
                        {c.sales_nav_profile_url ? (
                          <a
                            href={c.sales_nav_profile_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#2563eb",
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
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

        {/* PAGINATION */}
        <div
          style={{
            padding: "12px 24px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#fff",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: page <= 1 || loading ? "#f3f4f6" : "#fff",
              cursor: page <= 1 || loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Previous
          </button>

          {getPaginationNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => setPage(p)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: page === p ? "#facc15" : "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  minWidth: 36,
                }}
              >
                {p}
              </button>
            ) : (
              <span
                key={idx}
                style={{ padding: "0 4px", fontSize: 14, color: "#6b7280" }}
              >
                ...
              </span>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: page >= totalPages || loading ? "#f3f4f6" : "#fff",
              cursor: page >= totalPages || loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Next
          </button>
        </div>
      </main>

      {/* SELECTION MODAL */}
      {showSelectionModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: 0,
                marginBottom: 12,
              }}
            >
              Select contacts
            </h2>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                fontSize: 14,
              }}
            >
              <input
                type="radio"
                name="selection-mode"
                checked={selectionMode === "number"}
                onChange={() => setSelectionMode("number")}
                style={{ marginRight: 8 }}
              />
              <span>Select number of people</span>
            </label>
            <div
              style={{
                marginLeft: 26,
                marginBottom: 12,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                type="number"
                min={1}
                max={total || undefined}
                value={selectNumber}
                onChange={(e) =>
                  setSelectNumber(Math.max(1, Number(e.target.value) || 1))
                }
                style={{
                  width: 80,
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                }}
              />
            </div>

            <div
              style={{
                marginLeft: 26,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="checkbox"
                checked={limitPerCompany}
                onChange={() => setLimitPerCompany(!limitPerCompany)}
              />
              <span style={{ fontSize: 14 }}>Max people per company</span>
              <input
                type="number"
                min={1}
                value={maxPerCompany}
                onChange={(e) =>
                  setMaxPerCompany(Math.max(1, Number(e.target.value) || 1))
                }
                style={{
                  width: 60,
                  padding: "6px 8px",
                  borderRadius: 4,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  marginLeft: 8,
                }}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                fontSize: 14,
              }}
            >
              <input
                type="radio"
                name="selection-mode"
                checked={selectionMode === "this_page"}
                onChange={() => setSelectionMode("this_page")}
                style={{ marginRight: 8 }}
              />
              <span>Select this page ({currentPageCount})</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              <input
                type="radio"
                name="selection-mode"
                checked={selectionMode === "all"}
                onChange={() => setSelectionMode("all")}
                style={{ marginRight: 8 }}
              />
              <span>Select all ({total})</span>
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 8,
              }}
            >
              <button
                onClick={closeSelectionModal}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={applySelection}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: "#facc15",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                margin: 0,
                marginBottom: 12,
              }}
            >
              Export data
            </h2>
            <p
              style={{
                margin: 0,
                marginBottom: 16,
                fontSize: 14,
                color: "#4b5563",
              }}
            >
              {selectionSummary}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => exportData(true, false)}
                style={exportButtonStyle}
              >
                Export with email
              </button>
              <button
                onClick={() => exportData(false, true)}
                style={exportButtonStyle}
              >
                Export with phone
              </button>
              <button
                onClick={() => exportData(true, true)}
                style={exportButtonStyle}
              >
                Export with email & phone
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                onClick={closeExportModal}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
