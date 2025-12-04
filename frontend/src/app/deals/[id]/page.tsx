"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Deal = {
  deal_id: number;
  deal_name: string;
  deal_stage: string;
  amount: string | null;
  close_date: string | null;
  deal_owner: string | null;
  company: number | null;
  contact: number | null;
};

type Company = {
  company_id: number;
  company_name: string;
};

type Contact = {
  contact_id: number;
  full_name: string | null;
};

export default function DealDetail({ params }: { params: { id: string } }) {
  const dealId = params.id;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);

  async function loadDeal() {
    const res = await fetch(`${API_BASE_URL}/deals/${dealId}/`);
    const data = await res.json();
    setDeal(data);

    if (data.company) {
      const c = await fetch(`${API_BASE_URL}/companies/${data.company}/`);
      setCompany(await c.json());
    }

    if (data.contact) {
      const ct = await fetch(`${API_BASE_URL}/contacts/${data.contact}/`);
      setContact(await ct.json());
    }
  }

  useEffect(() => {
    loadDeal();
  }, []);

  if (!deal) return <p style={{ padding: 20 }}>Loading…</p>;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <a href="/deals" style={{ color: "#2563eb", fontSize: 13 }}>
        ← Back to deals
      </a>

      <h1 style={{ fontSize: 24, fontWeight: 600, marginTop: 12 }}>
        {deal.deal_name}
      </h1>

      <div style={{ marginTop: 12 }}>
        <b>Stage:</b> {deal.deal_stage}
      </div>
      <div>
        <b>Amount:</b> {deal.amount || "—"}
      </div>
      <div>
        <b>Close Date:</b> {deal.close_date || "—"}
      </div>
      <div>
        <b>Owner:</b> {deal.deal_owner || "—"}
      </div>

      <hr style={{ margin: "24px 0" }} />

      {company && (
        <div>
          <h3>Company</h3>
          <a
            href={`/companies/${company.company_id}`}
            style={{ color: "#2563eb" }}
          >
            {company.company_name}
          </a>
        </div>
      )}

      {contact && (
        <div style={{ marginTop: 16 }}>
          <h3>Contact</h3>
          <a
            href={`/contacts/${contact.contact_id}`}
            style={{ color: "#2563eb" }}
          >
            {contact.full_name || "Contact"}
          </a>
        </div>
      )}
    </div>
  );
}
