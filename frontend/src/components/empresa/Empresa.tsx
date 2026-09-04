"use client";

import { EmpresaHeader } from "@/components/empresa/EmpresaHeader";
import { EmpresaForm } from "@/components/empresa/EmpresaForm";
import { EmpresaInviteCode } from "@/components/empresa/EmpresaInviteCode";
import {
  EmpresaMembers,
  type EmpresaMember,
} from "@/components/empresa/EmpresaMembers";

interface EmpresaProps {
  company: {
    id: string;
    name: string;
    document: string | null;
    phoneNumber: string | null;
    inviteCode: string | null;
  };

  members: EmpresaMember[];

  currentUserId?: string;

  onUpdateCompany?: (values: {
    name: string;
    document: string;
    phoneNumber: string;
  }) => void | Promise<void>;

  onRegenerateInvite?: () => void | Promise<void>;

  onRemoveMember?: (member: EmpresaMember) => void | Promise<void>;
}

export function Empresa({
  company,
  members,
  currentUserId,
  onUpdateCompany,
  onRegenerateInvite,
  onRemoveMember,
}: EmpresaProps) {
  return (
    <div className="space-y-6">
      <EmpresaHeader companyName={company.name} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="space-y-5">
          <EmpresaForm
            initialValues={{
              name: company.name,
              document: company.document ?? "",
              phoneNumber: company.phoneNumber ?? "",
            }}
            onSubmit={onUpdateCompany}
          />

          <EmpresaMembers
            members={members}
            currentUserId={currentUserId}
            onRemoveMember={onRemoveMember}
          />
        </div>

        <div className="space-y-5">
          <EmpresaInviteCode
            code={company.inviteCode ?? ""}
            onRegenerate={onRegenerateInvite}
          />

          <CompanyAccessInfo memberCount={members.length} />
        </div>
      </div>
    </div>
  );
}

function CompanyAccessInfo({ memberCount }: { memberCount: number }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-surface-panel/60 p-5">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-brand-400">
        Acesso da empresa
      </p>

      <h3 className="mt-2 text-xs font-bold text-slate-200">
        Controle centralizado
      </h3>

      <p className="mt-1.5 text-[9px] leading-5 text-slate-600">
        Os colaboradores vinculados à empresa poderão acessar as informações
        permitidas pela plataforma.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <InfoItem label="Membros" value={String(memberCount)} />

        <InfoItem label="Convite" value="Disponível" />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-sidebar/60 p-3">
      <p className="text-[7px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-[9px] font-semibold text-slate-300">{value}</p>
    </div>
  );
}
