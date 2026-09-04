"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { FaChrome } from "react-icons/fa";

import { SecurityCard } from "./SecurityCard";
import { PasswordModal } from "./PasswordModal";

interface PerfilSecurityProps {
  authProvider?: "google" | "email";

  onChangePassword?: (password: string) => void | Promise<void>;

  onManageSessions?: () => void | Promise<void>;
}

export function PerfilSecurity({
  authProvider = "email",
  onChangePassword,
  onManageSessions,
}: PerfilSecurityProps) {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [sessionLoading, setSessionLoading] = useState(false);

  const [sessionMessage, setSessionMessage] = useState("");

  const isGoogle = authProvider === "google";

  async function handleManageSessions() {
    if (!onManageSessions) {
      return;
    }

    setSessionLoading(true);
    setSessionMessage("");

    try {
      await onManageSessions();

      setSessionMessage("As outras sessões foram encerradas.");
    } catch {
      setSessionMessage("Não foi possível encerrar as outras sessões.");
    } finally {
      setSessionLoading(false);
    }
  }

  async function handleChangePassword(password: string) {
    if (!onChangePassword) {
      return;
    }

    await onChangePassword(password);

    setIsPasswordOpen(false);
  }

  return (
    <>
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
          delay: 0.14,
        }}
        className="
          overflow-hidden
          rounded-2xl
          border border-surface-border
          bg-surface-panel/90
          shadow-xl
          shadow-black/10
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
              <ShieldCheck size={16} className="text-brand-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">Segurança</h2>

              <p
                className="
                mt-0.5
                text-[9px]
                text-slate-600
              "
              >
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
                : "Atualize sua senha para manter sua conta protegida."
            }
            actionLabel="Alterar senha"
            onClick={() => setIsPasswordOpen(true)}
          />

          <SecurityCard
            icon={<ShieldCheck size={15} className="text-brand-400" />}
            title="Sessões da conta"
            description="
              Encerre o acesso da sua conta em outros
              dispositivos.
            "
            actionLabel={
              sessionLoading ? "Encerrando..." : "Encerrar outras sessões"
            }
            onClick={handleManageSessions}
            loading={sessionLoading}
          />

          {sessionMessage && (
            <div
              className="
              rounded-xl
              border border-emerald-500/10
              bg-emerald-500/[0.05]
              p-3
            "
            >
              <p
                className="
                text-[9px]
                font-medium
                text-emerald-400
              "
              >
                {sessionMessage}
              </p>
            </div>
          )}
        </div>

        <div
          className="
          border-t border-surface-border
          bg-emerald-500/[0.025]
          px-5 py-4
          sm:px-6
        "
        >
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={14}
              className="
                mt-0.5
                shrink-0
                text-emerald-400
              "
            />

            <div>
              <p
                className="
                text-[9px]
                font-bold
                text-emerald-400
              "
              >
                Conta protegida
              </p>

              <p
                className="
                mt-1
                text-[8px]
                leading-4
                text-slate-600
              "
              >
                As alterações de segurança são aplicadas diretamente à sua
                conta.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isPasswordOpen && (
          <PasswordModal
            onClose={() => setIsPasswordOpen(false)}
            onSubmit={handleChangePassword}
          />
        )}
      </AnimatePresence>
    </>
  );
}
