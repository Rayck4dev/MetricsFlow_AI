"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import { FaChrome } from "react-icons/fa";

interface PerfilSecurityProps {
  authProvider?: "google" | "email";
  onChangePassword?: (password: string) => void | Promise<void>;
  onManageSessions?: () => void;
}

export function PerfilSecurity({
  authProvider = "google",
  onChangePassword,
  onManageSessions,
}: PerfilSecurityProps) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const isGoogle = authProvider === "google";

  function handleOpenPassword() {
    setIsPasswordOpen(true);
  }

  function handleClosePassword() {
    setIsPasswordOpen(false);
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14 }}
        className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
      >
        <div className="border-b border-surface-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
              <ShieldCheck size={16} className="text-brand-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Segurança</h2>

              <p className="mt-0.5 text-[9px] text-slate-600">
                Gerencie o acesso e a segurança da sua conta.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <SecurityCard
            icon={
              isGoogle ? (
                <FaChrome size={15} className="text-brand-400" />
              ) : (
                <KeyRound size={15} className="text-brand-400" />
              )
            }
            title={isGoogle ? "Conta conectada ao Google" : "Acesso por e-mail"}
            description={
              isGoogle
                ? "Sua autenticação principal é feita através da conta Google conectada."
                : "Sua conta utiliza e-mail e senha para autenticação."
            }
            actionLabel={isGoogle ? "Google conectado" : "E-mail ativo"}
            disabled
          />

          <SecurityCard
            icon={<LockKeyhole size={15} className="text-brand-400" />}
            title="Senha da conta"
            description={
              isGoogle
                ? "Você pode definir uma senha para ter uma forma alternativa de acesso à sua conta."
                : "Atualize sua senha periodicamente para manter sua conta protegida."
            }
            actionLabel="Alterar senha"
            onClick={handleOpenPassword}
          />

          <SecurityCard
            icon={<ShieldCheck size={15} className="text-brand-400" />}
            title="Sessões da conta"
            description="Gerencie os dispositivos que possuem acesso à sua conta."
            actionLabel="Gerenciar sessões"
            onClick={onManageSessions}
          />
        </div>

        <div className="border-t border-surface-border bg-emerald-500/[0.025] px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={14}
              className="mt-0.5 shrink-0 text-emerald-400"
            />

            <div>
              <p className="text-[9px] font-bold text-emerald-400">
                Conta protegida
              </p>

              <p className="mt-1 text-[8px] leading-4 text-slate-600">
                Suas configurações de segurança serão sincronizadas com o
                sistema de autenticação quando o backend estiver conectado.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isPasswordOpen && (
          <PasswordModal
            onClose={handleClosePassword}
            onSubmit={async (password) => {
              await onChangePassword?.(password);
              handleClosePassword();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick?: () => void;
  disabled?: boolean;
}

function SecurityCard({
  icon,
  title,
  description,
  actionLabel,
  onClick,
  disabled = false,
}: SecurityCardProps) {
  return (
    <motion.div
      whileHover={
        disabled
          ? undefined
          : {
              y: -2,
            }
      }
      transition={{
        duration: 0.2,
      }}
      className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface-sidebar/70 p-4 sm:flex-row sm:items-center"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-xs font-bold text-slate-200">{title}</h3>

        <p className="mt-1 text-[9px] leading-4 text-slate-600">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-[9px] font-bold transition-all ${
          disabled
            ? "cursor-default border-emerald-500/10 bg-emerald-500/[0.05] text-emerald-400"
            : "border-surface-border bg-surface-panel text-slate-400 hover:border-brand-500/30 hover:bg-brand-500/[0.04] hover:text-brand-300 active:scale-[0.98]"
        }`}
      >
        {actionLabel}

        {!disabled && <ArrowRight size={11} />}
      </button>
    </motion.div>
  );
}

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void | Promise<void>;
}

function PasswordModal({ onClose, onSubmit }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const passwordIsValid = password.length >= 6;

  const passwordsMatch =
    password.length > 0 && confirmation.length > 0 && password === confirmation;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordIsValid) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await onSubmit(password);
    } catch {
      setError("Não foi possível alterar a senha. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 12,
          scale: 0.98,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-surface-border bg-surface-panel shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between border-b border-surface-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
              <LockKeyhole size={17} className="text-brand-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Alterar senha</h2>

              <p className="mt-0.5 text-[9px] text-slate-600">
                Defina uma nova senha para sua conta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="rounded-xl border border-brand-500/10 bg-brand-500/[0.035] p-3.5">
            <div className="flex gap-3">
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-brand-400"
              />

              <p className="text-[8px] leading-4 text-slate-500">
                Use uma senha com pelo menos 6 caracteres. Evite informações
                fáceis de adivinhar.
              </p>
            </div>
          </div>

          <PasswordField
            label="Nova senha"
            value={password}
            visible={showPassword}
            onChange={(value) => {
              setPassword(value);
              setError("");
            }}
            onToggle={() => setShowPassword((current) => !current)}
          />

          <PasswordField
            label="Confirmar nova senha"
            value={confirmation}
            visible={showConfirmation}
            onChange={(value) => {
              setConfirmation(value);
              setError("");
            }}
            onToggle={() => setShowConfirmation((current) => !current)}
          />

          {password.length > 0 && (
            <div className="space-y-2">
              <PasswordRequirement
                valid={passwordIsValid}
                text="Pelo menos 6 caracteres"
              />

              <PasswordRequirement
                valid={passwordsMatch}
                text="As senhas coincidem"
              />
            </div>
          )}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              className="flex items-start gap-2 rounded-xl border border-red-500/15 bg-red-500/[0.05] p-3"
            >
              <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-400" />

              <p className="text-[9px] leading-4 text-red-400">{error}</p>
            </motion.div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-surface-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-xl border border-surface-border px-4 text-[10px] font-bold text-slate-500 transition-colors hover:bg-white/[0.03] hover:text-slate-300 disabled:opacity-50"
            >
              Cancelar
            </button>

            <motion.button
              type="submit"
              disabled={saving || !passwordIsValid || !passwordsMatch}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-[10px] font-bold text-white shadow-lg shadow-brand-600/10 transition-colors hover:bg-brand-500 disabled:pointer-events-none disabled:opacity-40"
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}

              {saving ? "Salvando..." : "Salvar nova senha"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={
            label === "Nova senha" ? "new-password" : "new-password"
          }
          className="h-11 w-full rounded-xl border border-surface-border bg-surface-sidebar px-3.5 pr-11 text-xs font-medium text-slate-200 outline-none transition-all placeholder:text-slate-700 hover:border-slate-600 focus:border-brand-500/60 focus:bg-surface-main focus:ring-2 focus:ring-brand-500/10"
          placeholder="Digite sua senha"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.04] hover:text-slate-300"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-surface-sidebar text-slate-700"
        }`}
      >
        <Check size={9} />
      </div>

      <span
        className={`text-[8px] ${
          valid ? "text-emerald-400" : "text-slate-600"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
