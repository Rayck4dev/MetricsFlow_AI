"use client";

import { motion } from "framer-motion";
import {
  Crown,
  ShieldCheck,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";

export type EmpresaMemberRole = "owner" | "collaborator";
export type EmpresaMemberStatus = "active" | "pending";

export interface EmpresaMember {
  id: string;
  name: string;
  email: string;
  role: EmpresaMemberRole;
  status?: EmpresaMemberStatus;
}

interface EmpresaMembersProps {
  members: EmpresaMember[];
  currentUserId?: string;
  currentUserRole?: EmpresaMemberRole;
  onRemoveMember?: (member: EmpresaMember) => void | Promise<void>;
}

export function EmpresaMembers({
  members,
  currentUserId,
  currentUserRole = "collaborator",
  onRemoveMember,
}: EmpresaMembersProps) {
  const isOwner = currentUserRole === "owner";
  const hasMembers = members.length > 0;

  async function handleRemove(member: EmpresaMember) {
    if (!canRemoveMember(member)) {
      return;
    }

    const confirmed = window.confirm(
      `Remover ${getDisplayName(member)} da empresa?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await onRemoveMember?.(member);
    } catch (error) {
      console.error("Erro ao remover membro da empresa:", error);
    }
  }

  function canRemoveMember(member: EmpresaMember) {
    return (
      isOwner &&
      member.role !== "owner" &&
      member.id !== currentUserId &&
      !!onRemoveMember
    );
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
      className="overflow-hidden rounded-2xl border border-surface-border bg-surface-panel/90 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <MembersHeader count={members.length} />

      {!hasMembers ? (
        <EmptyState isOwner={isOwner} />
      ) : (
        <div className="divide-y divide-surface-border">
          {members.map((member, index) => (
            <MemberRow
              key={member.id}
              member={member}
              index={index}
              isCurrentUser={member.id === currentUserId}
              canRemove={canRemoveMember(member)}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

function MembersHeader({ count }: { count: number }) {
  return (
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

      <span className="rounded-full border border-surface-border bg-surface-sidebar px-2.5 py-1 text-[8px] font-bold text-slate-500">
        {count} {count === 1 ? "membro" : "membros"}
      </span>
    </div>
  );
}

function EmptyState({ isOwner }: { isOwner: boolean }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center px-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/[0.06] text-brand-400">
        <UserRound size={18} />
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-300">
        Nenhum membro encontrado
      </p>

      <p className="mt-1 max-w-xs text-[9px] leading-4 text-slate-600">
        {isOwner
          ? "Compartilhe o código de convite para adicionar colaboradores."
          : "Nenhum colaborador foi adicionado à empresa."}
      </p>
    </div>
  );
}

interface MemberRowProps {
  member: EmpresaMember;
  index: number;
  isCurrentUser: boolean;
  canRemove: boolean;
  onRemove: (member: EmpresaMember) => void | Promise<void>;
}

function MemberRow({
  member,
  index,
  isCurrentUser,
  canRemove,
  onRemove,
}: MemberRowProps) {
  const owner = member.role === "owner";

  const displayName = getDisplayName(member);
  const displayEmail = getDisplayEmail(member);
  const initials = getInitials(member.name);

  return (
    <motion.div
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
      className="flex items-center gap-3 px-5 py-4"
    >
      <MemberAvatar initials={initials} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-[10px] font-bold text-slate-200">
            {displayName}
          </p>

          {isCurrentUser && <CurrentUserBadge />}

          {member.status === "pending" && <PendingBadge />}
        </div>

        <p className="mt-0.5 truncate text-[8px] text-slate-600">
          {displayEmail}
        </p>
      </div>

      <MemberRole role={member.role} />

      {canRemove && (
        <RemoveButton
          memberName={displayName}
          onClick={() => onRemove(member)}
        />
      )}
    </motion.div>
  );
}

function MemberAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/10 bg-brand-500/[0.07] text-[10px] font-bold text-brand-300">
      {initials || <UserRound size={14} />}
    </div>
  );
}

function CurrentUserBadge() {
  return (
    <span className="rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[7px] font-bold text-brand-300">
      Você
    </span>
  );
}

function PendingBadge() {
  return (
    <span className="rounded-full border border-amber-500/15 bg-amber-500/[0.06] px-1.5 py-0.5 text-[7px] font-bold text-amber-400">
      Pendente
    </span>
  );
}

function MemberRole({ role }: { role: EmpresaMemberRole }) {
  const owner = role === "owner";

  return (
    <div className="hidden items-center gap-1.5 sm:flex">
      {owner ? (
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
  );
}

function RemoveButton({
  memberName,
  onClick,
}: {
  memberName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remover ${memberName}`}
      title="Remover colaborador"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-surface-sidebar text-slate-500 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
    >
      <Trash2 size={13} />
    </button>
  );
}

function getDisplayName(member: EmpresaMember) {
  return member.name?.trim() || "Nome não informado";
}

function getDisplayEmail(member: EmpresaMember) {
  return member.email?.trim() || "E-mail não informado";
}

function getInitials(name: string) {
  return name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
