import { motion } from "framer-motion";
import { Crown, ShieldCheck, Trash2, UserRound } from "lucide-react";
import type { EmpresaMember, EmpresaMemberRole } from "../EmpresaMembers";

interface MemberRowProps {
  member: EmpresaMember;
  index: number;
  isCurrentUser: boolean;
  canRemove: boolean;
  onRemove: (member: EmpresaMember) => void | Promise<void>;
}

export function MemberRow({
  member,
  index,
  isCurrentUser,
  canRemove,
  onRemove,
}: MemberRowProps) {
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

export function MemberAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-500/10 bg-brand-500/[0.07] text-[10px] font-bold text-brand-300">
      {initials || <UserRound size={14} />}
    </div>
  );
}

export function CurrentUserBadge() {
  return (
    <span className="rounded-full bg-brand-500/10 px-1.5 py-0.5 text-[7px] font-bold text-brand-300">
      Você
    </span>
  );
}

export function PendingBadge() {
  return (
    <span className="rounded-full border border-amber-500/15 bg-amber-500/[0.06] px-1.5 py-0.5 text-[7px] font-bold text-amber-400">
      Pendente
    </span>
  );
}

export function MemberRole({ role }: { role: EmpresaMemberRole }) {
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

export function RemoveButton({
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

export function getDisplayName(member: EmpresaMember) {
  return member.name?.trim() || "Nome não informado";
}

export function getDisplayEmail(member: EmpresaMember) {
  return member.email?.trim() || "E-mail não informado";
}

export function getInitials(name: string) {
  return name
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
