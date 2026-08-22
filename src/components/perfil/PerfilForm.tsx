"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Save, UserRound } from "lucide-react";
import { motion } from "framer-motion";

interface PerfilValues {
  name: string;
  email: string;
  phone: string;
}

interface PerfilFormProps {
  initialValues?: Partial<PerfilValues>;
  onSubmit?: (values: PerfilValues) => void | Promise<void>;
}

const DEFAULT_VALUES: PerfilValues = {
  name: "",
  email: "",
  phone: "",
};

export function PerfilForm({ initialValues, onSubmit }: PerfilFormProps) {
  const values: PerfilValues = {
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  const [name, setName] = useState(values.name);
  const [email, setEmail] = useState(values.email);
  const [phone, setPhone] = useState(values.phone);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setEmail(initialValues?.email ?? "");
    setPhone(initialValues?.phone ?? "");
  }, [initialValues]);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : "";
    }

    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "Informe seu nome.";
    }

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Informe um e-mail válido.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      await onSubmit?.({
        name: name.trim(),
        email: email.trim(),
        phone,
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
            <UserRound size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Informações pessoais
            </h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Atualize os dados básicos da sua conta.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Nome completo"
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
            placeholder="Seu nome"
            error={errors.name}
          />

          <Field
            label="E-mail"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);

              if (errors.email) {
                setErrors((current) => ({
                  ...current,
                  email: "",
                }));
              }
            }}
            placeholder="seu@email.com"
            error={errors.email}
          />

          <Field
            label="Telefone"
            value={phone}
            onChange={(value) => setPhone(formatPhone(value))}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3.5">
          <p className="text-[9px] font-semibold text-brand-300">
            Seus dados ficam vinculados à sua conta.
          </p>

          <p className="mt-1 text-[8px] leading-4 text-slate-600">
            No backend, essas informações serão sincronizadas com a autenticação
            da plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-surface-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] text-slate-600">
            Alterações ficam disponíveis para sua conta.
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

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <input
        type={type}
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
