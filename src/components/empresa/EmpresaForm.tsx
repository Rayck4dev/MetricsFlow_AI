"use client";

import { useEffect, useState } from "react";
import { Building2, Check, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

interface EmpresaFormValues {
  name: string;
  document: string;
  phoneNumber: string;
}

interface EmpresaFormProps {
  initialValues: EmpresaFormValues;

  onSubmit?: (values: EmpresaFormValues) => void | Promise<void>;
}

export function EmpresaForm({ initialValues, onSubmit }: EmpresaFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [document, setDocument] = useState(initialValues.document);
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(initialValues.name);
    setDocument(initialValues.document);
    setPhoneNumber(initialValues.phoneNumber);
  }, [initialValues]);

  function formatDocument(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14);

    if (digits.length <= 11) {
      if (digits.length <= 3) return digits;

      if (digits.length <= 6) {
        return `${digits.slice(0, 3)}.${digits.slice(3)}`;
      }

      if (digits.length <= 9) {
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      }

      return `${digits.slice(0, 3)}.${digits.slice(
        3,
        6,
      )}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }

    return `${digits.slice(0, 2)}.${digits.slice(
      2,
      5,
    )}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      return digits ? `(${digits}` : "";
    }

    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Informe o nome da empresa.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setSaving(true);
    setSaved(false);

    try {
      await onSubmit?.({
        name: name.trim(),
        document,
        phoneNumber,
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 }}
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="border-b border-surface-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <Building2 size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Dados da empresa</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Mantenha os dados da sua empresa atualizados.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Nome da empresa"
            value={name}
            onChange={(value) => {
              setName(value);

              if (errors.name) {
                setErrors((current) => ({
                  ...current,
                  name: "",
                }));
              }
            }}
            placeholder="Nome da empresa"
            error={errors.name}
          />

          <Field
            label="CPF / CNPJ"
            value={document}
            onChange={(value) => setDocument(formatDocument(value))}
            placeholder="000.000.000-00"
          />

          <Field
            label="WhatsApp / Telefone"
            value={phoneNumber}
            onChange={(value) => setPhoneNumber(formatPhone(value))}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3.5">
          <p className="text-[9px] font-semibold text-brand-300">
            Dados vinculados à empresa
          </p>

          <p className="mt-1 text-[8px] leading-4 text-slate-600">
            Essas informações serão sincronizadas com a empresa cadastrada no
            backend.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-surface-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] text-slate-600">
            As alterações serão aplicadas à empresa.
          </p>

          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[10px] font-bold text-white shadow-lg shadow-brand-600/10 transition-colors hover:bg-brand-500 disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : saved ? (
              <Check size={13} />
            ) : (
              <Save size={13} />
            )}

            {saving
              ? "Salvando..."
              : saved
                ? "Alterações salvas"
                : "Salvar alterações"}
          </motion.button>
        </div>
      </form>
    </motion.section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-surface-sidebar px-3.5 text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 ${
          error
            ? "border-red-500/50 focus:border-red-400"
            : "border-surface-border hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
        }`}
      />

      {error && <p className="text-[9px] font-medium text-red-400">{error}</p>}
    </div>
  );
}
