"use client";

import { motion } from "framer-motion";
import {
  Crown,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

export interface EmpresaMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "collaborator";
  status?: "active" | "pending";
}

interface EmpresaMembersProps {
  members: EmpresaMember[];

  currentUserId?: string;

  /**
   * Papel do usuário atualmente logado.
   *
   * Owner:
   * - Pode remover colaboradores.
   *
   * Collaborator:
   * - Apenas visualiza os membros.
   * - Não pode remover ninguém.
   */
  currentUserRole?: "owner" | "collaborator";

  onRemoveMember?: (member: EmpresaMember) => void | Promise<void>;
}

export function EmpresaMembers({
  members,
  currentUserId,
  currentUserRole = "collaborator",
  onRemoveMember,
}: EmpresaMembersProps) {
  /*
   * =========================================================
   * REMOVER COLABORADOR
   * =========================================================
   */

  async function handleRemove(member: EmpresaMember) {
    /*
     * Apenas o proprietário pode remover membros.
     */
    if (currentUserRole !== "owner") {
      return;
    }

    /*
     * Não permite remover o próprio usuário.
     */
    if (member.id === currentUserId) {
      return;
    }

    /*
     * Não permite remover o proprietário.
     */
    if (member.role === "owner") {
      return;
    }

    /*
     * Callback não informado.
     */
    if (!onRemoveMember) {
      return;
    }

    const confirmed = window.confirm(
      `Remover ${member.name || "este colaborador"} da empresa?`,
    );

    if (!confirmed) {
      return;
    }

    await onRemoveMember(member);
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
        delay: 0.2,
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
            <UsersRound size={16} className="text-brand-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Membros da empresa</h2>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Pessoas com acesso à empresa.
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            border border-surface-border
            bg-surface-sidebar
            px-2.5 py-1
            text-[8px]
            font-bold
            text-slate-500
          "
        >
          {members.length} {members.length === 1 ? "membro" : "membros"}
        </span>
      </div>

      {/* =====================================================
          LISTA VAZIA
      ===================================================== */}

      {members.length === 0 ? (
        <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              bg-brand-500/[0.06]
              text-brand-400
            "
          >
            <UserRound size={18} />
          </div>

          <p className="mt-3 text-xs font-semibold text-slate-300">
            Nenhum membro encontrado
          </p>

          <p className="mt-1 max-w-xs text-[9px] leading-4 text-slate-600">
            {currentUserRole === "owner"
              ? "Compartilhe o código de convite para adicionar colaboradores."
              : "Nenhum colaborador foi adicionado à empresa."}
          </p>
        </div>
      ) : (
        /* =====================================================
           LISTA DE MEMBROS
        ===================================================== */

        <div className="divide-y divide-surface-border">
          {members.map((member, index) => {
            const isOwner = member.role === "owner";

            const isCurrentUser = member.id === currentUserId;

            const canRemove =
              currentUserRole === "owner" &&
              !isOwner &&
              !isCurrentUser &&
              !!onRemoveMember;

            const displayName = member.name?.trim() || "Nome não informado";

            const displayEmail = member.email?.trim() || "E-mail não informado";

            const initials = member.name
              ?.trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");

            return (
              <motion.div
                key={member.id}
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                }}
                className="
                  flex
                  items-center
                  gap-3
                  px-5 py-4
                "
              >
                {/* =================================================
                    AVATAR
                ================================================= */}

                <div
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    border border-brand-500/10
                    bg-brand-500/[0.07]
                    text-[10px]
                    font-bold
                    text-brand-300
                  "
                >
                  {initials || <UserRound size={14} />}
                </div>

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[10px] font-bold text-slate-200">
                      {displayName}
                    </p>

                    {isCurrentUser && (
                      <span
                        className="
                          rounded-full
                          bg-brand-500/10
                          px-1.5 py-0.5
                          text-[7px]
                          font-bold
                          text-brand-300
                        "
                      >
                        Você
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 truncate text-[8px] text-slate-600">
                    {displayEmail}
                  </p>
                </div>

                {/* =================================================
                    PAPEL
                ================================================= */}

                <div className="hidden items-center gap-1.5 sm:flex">
                  {isOwner ? (
                    <>
                      <Crown size={11} className="text-amber-400" />

                      <span className="text-[8px] font-semibold text-amber-400">
                        Proprietário
                      </span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={11} className="text-slate-500" />

                      <span className="text-[8px] font-semibold text-slate-500">
                        Colaborador
                      </span>
                    </>
                  )}
                </div>

                {/* =================================================
                    REMOVER COLABORADOR
                ================================================= */}

                {canRemove && (
                  <button
                    type="button"
                    onClick={() => handleRemove(member)}
                    aria-label={`Remover ${displayName}`}
                    title="Remover colaborador"
                    className="
                      flex h-8 w-8
                      shrink-0
                      items-center justify-center
                      rounded-lg
                      border border-surface-border
                      bg-surface-sidebar
                      text-slate-500
                      transition-all

                      hover:border-red-500/20
                      hover:bg-red-500/10
                      hover:text-red-400

                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500/20
                    "
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
