"use client";

import { motion } from "framer-motion";
import {
  EmptyState,
  getDisplayName,
  MemberRow,
  MembersHeader,
} from "./empresa-members/EmpresaMembersSections";

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
