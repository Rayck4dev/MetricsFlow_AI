"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header, Field, SubmitError, FormActions, CompanyDataNotice } from "./empresa-form/EmpresaFormSections";

interface EmpresaFormValues {
  name: string;
  document: string;
  phoneNumber: string;
}

interface EmpresaFormProps {
  initialValues: EmpresaFormValues;
  onSubmit?: (values: EmpresaFormValues) => void | Promise<void>;
}

type FormErrors = {
  name?: string;
  submit?: string;
};

export function EmpresaForm({ initialValues, onSubmit }: EmpresaFormProps) {
  const [form, setForm] = useState<EmpresaFormValues>(initialValues);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  function updateField(field: keyof EmpresaFormValues, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function handleNameChange(value: string) {
    updateField("name", value);
  }

  function handleDocumentChange(value: string) {
    updateField("document", formatDocument(value));
  }

  function handlePhoneChange(value: string) {
    updateField("phoneNumber", formatPhone(value));
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Informe o nome da empresa.";
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
        name: form.name.trim(),
        document: form.document,
        phoneNumber: form.phoneNumber,
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2200);
    } catch (error) {
      console.error("Erro ao salvar dados da empresa:", error);

      setErrors({
        submit: "Não foi possível salvar as alterações.",
      });
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
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <Header />

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Nome da empresa"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Nome da empresa"
            error={errors.name}
          />

          <Field
            label="CPF / CNPJ"
            value={form.document}
            onChange={handleDocumentChange}
            placeholder="000.000.000-00"
          />

          <Field
            label="WhatsApp / Telefone"
            value={form.phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        {errors.submit && <SubmitError message={errors.submit} />}

        <CompanyDataNotice />

        <FormActions saving={saving} saved={saved} />
      </form>
    </motion.section>
  );
}

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 11) {
    if (digits.length <= 3) {
      return digits;
    }

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
