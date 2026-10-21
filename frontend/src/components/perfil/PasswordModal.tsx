"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PasswordModalActions,
  PasswordModalError,
  PasswordModalHeader,
  PasswordModalHint,
} from "./password-modal/PasswordModalSections";

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
        <PasswordModalHeader onClose={onClose} />

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <PasswordModalHint />

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

          {error && <PasswordModalError error={error} />}

          <PasswordModalActions
            saving={saving}
            canSave={passwordIsValid && passwordsMatch}
            onClose={onClose}
          />
        </form>
      </motion.div>
    </motion.div>
  );
}
