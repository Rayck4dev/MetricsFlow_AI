"use client";

import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { FaChrome } from "react-icons/fa";
import { SecurityCard } from "../SecurityCard";

interface SecurityOptionsProps {
  isGoogle: boolean;
  sessionLoading: boolean;
  sessionMessage: string;
  onChangePasswordClick: () => void;
  onManageSessions: () => void | Promise<void>;
}

export function SecurityOptions({
  isGoogle,
  sessionLoading,
  sessionMessage,
  onChangePasswordClick,
  onManageSessions,
}: SecurityOptionsProps) {
  return (
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
        onClick={onChangePasswordClick}
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
        onClick={onManageSessions}
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
  );
}
