"use client";

import React, { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imported_contacts?: number;
    new_companies?: number;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please choose a CSV file before uploading.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/contacts/bulk_import/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}): ${text}`);
      }

      const data = await res.json();
      setResult(data);
      setMessage("Import completed successfully.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
        Bulk Import Contacts
      </h1>

      <p style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
        Export your Google Sheet as CSV and upload it here. The header row
        should match your columns (Sr. No., FullName, First Name, Last Name,
        Job Title, Company Name, etc.).
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              setError(null);
              setMessage(null);
            }}
          />
          {file && (
            <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
              Selected: {file.name}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: "1px solid #2563eb",
            background: loading ? "#93c5fd" : "#2563eb",
            color: "#fff",
            fontSize: 14,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Uploading…" : "Upload CSV"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 10,
            borderRadius: 6,
            background: "#e0f2fe",
            color: "#075985",
            fontSize: 14,
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 16,
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

      {result && (
        <div
          style={{
            marginTop: 16,
            padding: 10,
            borderRadius: 6,
            background: "#f1f5f9",
            fontSize: 14,
          }}
        >
          <div>Imported contacts: {result.imported_contacts ?? 0}</div>
          <div>New companies: {result.new_companies ?? 0}</div>
        </div>
      )}
    </div>
  );
}
