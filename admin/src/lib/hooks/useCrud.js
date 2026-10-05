import { useState } from 'react';
export function useCrud(emptyForm = {}) {
  const [form, setFormState] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const setForm = (update) => setFormState((prev) => (typeof update === 'function' ? update(prev) : update));
  const openAdd = () => {
    setFormState(emptyForm);
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (record) => {
    setFormState({ ...record });
    setEditId(record.id);
    setShowForm(true);
  };
  // ── THE FIX: always reset editId when closing ──────────────────────────
  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormState(emptyForm);
  };
  const save = async (baseUrl, fetchFn = fetch) => {
    setSaving(true);
    const url = editId ? `${baseUrl}/${encodeURIComponent(editId)}` : baseUrl;
    const method = editId ? 'PUT' : 'POST';
    try {
      const res = await fetchFn(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(body.error ?? 'Request failed');
      }
      const data = await res.json();
      setShowForm(false);
      setEditId(null);
      return data;
    } finally {
      setSaving(false);
    }
  };
  return { form, editId, showForm, saving, setForm, openAdd, openEdit, closeForm, save };
}
