import { User } from "lucide-react";
import {
  RegistrationTypeSelect,
  type RegistrationType,
} from "@/components/auth/RegistrationTypeSelect";
import { CompanyField } from "./CompanyField";
import { InviteCodeField } from "./InviteCodeField";

interface RegisterCompanyDetailsProps {
  name: string;
  company: string;
  inviteCode: string;
  registrationType: RegistrationType;
  disabled: boolean;
  onNameChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onInviteCodeChange: (value: string) => void;
  onRegistrationTypeChange: (value: RegistrationType) => void;
}

export function RegisterCompanyDetails({
  name,
  company,
  inviteCode,
  registrationType,
  disabled,
  onNameChange,
  onCompanyChange,
  onInviteCodeChange,
  onRegistrationTypeChange,
}: RegisterCompanyDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-xs font-semibold text-slate-300"
          >
            Seu nome
          </label>

          <div className="relative">
            <User
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Seu nome"
              disabled={disabled}
              className="h-10 w-full rounded-xl border border-surface-border bg-surface-sidebar pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <RegistrationTypeSelect
          value={registrationType}
          onChange={onRegistrationTypeChange}
          disabled={disabled}
        />
      </div>

      {registrationType === "create_company" ? (
        <CompanyField
          value={company}
          onChange={onCompanyChange}
          disabled={disabled}
        />
      ) : (
        <InviteCodeField
          value={inviteCode}
          onChange={onInviteCodeChange}
          disabled={disabled}
        />
      )}
    </>
  );
}
