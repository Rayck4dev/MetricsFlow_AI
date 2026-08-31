"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { motion } from "framer-motion";

import { PerfilField } from "./PerfilField";
import { PerfilInfoCard } from "./PerfilInfoCard";
import { PerfilSubmitButton } from "./PerfilSubmitButton";

export interface PerfilValues {
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
  const [name, setName] = useState(initialValues?.name ?? DEFAULT_VALUES.name);

  const [email, setEmail] = useState(
    initialValues?.email ?? DEFAULT_VALUES.email,
  );

  const [phone, setPhone] = useState(
    initialValues?.phone ?? DEFAULT_VALUES.phone,
  );

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof PerfilValues, string>>
  >({});

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

  function clearError(field: keyof PerfilValues) {
    if (!errors[field]) {
      return;
    }

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof PerfilValues, string>> = {};

    if (!name.trim()) {
      nextErrors.name = "Informe seu nome.";
    }

    if (!email.trim()) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
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
        phone: phone.trim(),
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2200);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        delay: 0.08,
      }}
      className="
        overflow-hidden
        rounded-2xl
        border border-surface-border
        bg-surface-panel/90
        shadow-xl shadow-black/10
        backdrop-blur-xl
      "
    >
      <div
        className="
          border-b border-surface-border
          px-5 py-4
          sm:px-6
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-brand-500/10
            "
          >
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
          <PerfilField
            label="Nome completo"
            value={name}
            onChange={(value) => {
              setName(value);
              clearError("name");
            }}
            placeholder="Seu nome"
            error={errors.name}
          />

          <PerfilField
            label="E-mail"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              clearError("email");
            }}
            placeholder="seu@email.com"
            error={errors.email}
          />

          <PerfilField
            label="Telefone"
            value={phone}
            onChange={(value) => {
              setPhone(formatPhone(value));
              clearError("phone");
            }}
            placeholder="Opcional — (00) 00000-0000"
          />
        </div>

        <PerfilInfoCard />

        <div
          className="
            flex flex-col gap-3
            border-t border-surface-border
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="text-[8px] text-slate-600">
            As alterações são salvas na sua conta.
          </p>

          <PerfilSubmitButton saving={saving} saved={saved} />
        </div>
      </form>
    </motion.section>
  );
}
