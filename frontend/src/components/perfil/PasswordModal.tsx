"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  LockKeyhole,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import { PasswordField } from "./PasswordField";
import { PasswordRequirement } from "./PasswordRequirement";

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void | Promise<void>;
}

export function PasswordModal({ onClose, onSubmit }: PasswordModalProps) {
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[200]
        flex items-center justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
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
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-surface-border
          bg-surface-panel
          shadow-2xl
          shadow-black/40
        "
      >
        <div
          className="
          flex items-start justify-between
          border-b border-surface-border
          p-5
        "
        >
          <div className="flex items-center gap-3">
            <div
              className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-brand-500/10
            "
            >
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
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-slate-600
              transition-colors
              hover:bg-white/[0.04]
              hover:text-slate-300
            "
            aria-label="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div
            className="
            rounded-xl
            border border-brand-500/10
            bg-brand-500/[0.035]
            p-3.5
          "
          >
            <div className="flex gap-3">
              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-brand-400"
              />

              <p
                className="
                text-[8px]
                leading-4
                text-slate-500
              "
              >
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
              className="
                flex items-start gap-2
                rounded-xl
                border border-red-500/15
                bg-red-500/[0.05]
                p-3
              "
            >
              <AlertCircle
                size={13}
                className="
                  mt-0.5
                  shrink-0
                  text-red-400
                "
              />

              <p
                className="
                text-[9px]
                leading-4
                text-red-400
              "
              >
                {error}
              </p>
            </motion.div>
          )}

          <div
            className="
            flex flex-col-reverse
            gap-2
            border-t border-surface-border
            pt-4
            sm:flex-row
            sm:justify-end
          "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                h-10
                rounded-xl
                border border-surface-border
                px-4
                text-[10px]
                font-bold
                text-slate-500
                transition-colors
                hover:bg-white/[0.03]
                hover:text-slate-300
                disabled:opacity-50
              "
            >
              Cancelar
            </button>

            <motion.button
              type="submit"
              disabled={saving || !passwordIsValid || !passwordsMatch}
              whileTap={{ scale: 0.98 }}
              className="
                inline-flex h-10
                items-center justify-center gap-2
                rounded-xl
                bg-brand-600
                px-5
                text-[10px]
                font-bold
                text-white
                shadow-lg
                shadow-brand-600/10
                transition-colors
                hover:bg-brand-500
                disabled:pointer-events-none
                disabled:opacity-40
              "
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
