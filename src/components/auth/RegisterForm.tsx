"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Users,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type RegistrationType = "create_company" | "join_company";

const registrationOptions: {
  value: RegistrationType;
  label: string;
  description: string;
  icon: typeof Building2;
}[] = [
  {
    value: "create_company",
    label: "Criar uma empresa",
    description: "Vou administrar meu próprio negócio.",
    icon: Building2,
  },
  {
    value: "join_company",
    label: "Entrar em uma empresa",
    description: "Tenho um código de convite.",
    icon: Users,
  },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("create_company");

  const [selectOpen, setSelectOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    registrationOptions.find((option) => option.value === registrationType) ??
    registrationOptions[0];

  const SelectedIcon = selectedOption.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setSelectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleRegistrationTypeChange(type: RegistrationType) {
    setRegistrationType(type);
    setSelectOpen(false);
    setError("");

    if (type === "create_company") {
      setInviteCode("");
    } else {
      setCompany("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (!name.trim()) {
        setError("Informe seu nome.");
        setLoading(false);
        return;
      }

      if (!email.trim()) {
        setError("Informe seu e-mail.");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("A senha deve possuir pelo menos 6 caracteres.");
        setLoading(false);
        return;
      }

      if (registrationType === "create_company" && !company.trim()) {
        setError("Informe o nome da empresa.");
        setLoading(false);
        return;
      }

      if (registrationType === "join_company" && !inviteCode.trim()) {
        setError("Informe o código de convite da empresa.");
        setLoading(false);
        return;
      }

      const normalizedInviteCode =
        registrationType === "join_company"
          ? inviteCode.trim().toUpperCase()
          : "";

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),

            registration_type: registrationType,

            company_name:
              registrationType === "create_company" ? company.trim() : null,

            invite_code:
              registrationType === "join_company" ? normalizedInviteCode : null,
          },
        },
      });

      if (error) {
        console.error("❌ Erro no cadastro:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("O cadastro não criou o usuário.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "metricsflow_registration",
        JSON.stringify({
          type: registrationType,

          companyName:
            registrationType === "create_company" ? company.trim() : "",

          inviteCode: normalizedInviteCode,
        }),
      );

      if (!data.session) {
        window.location.href = "/login?registered=true";
        return;
      }

      window.location.href = "/onboarding";
    } catch (err) {
      console.error("💥 Erro inesperado:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado no cadastro.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true);
    setError("");

    try {
      sessionStorage.setItem(
        "metricsflow_registration",
        JSON.stringify({
          type: "google",
        }),
      );

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("❌ Erro Google:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível continuar com o Google.",
      );

      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-4">
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
          <Building2 size={17} className="text-brand-400" />
        </div>

        <h1 className="font-heading text-xl font-bold tracking-tight text-white">
          Crie sua conta
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Comece a organizar as finanças da sua empresa de forma simples.
        </p>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-[11px] leading-4 text-red-300">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* ===================================================
            LINHA 1
            NOME + TIPO DE ACESSO
        ==================================================== */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* NOME */}

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
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                className="
                  h-10 w-full rounded-xl
                  border border-surface-border
                  bg-surface-sidebar
                  pl-9 pr-3
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />
            </div>
          </div>

          {/* =================================================
              TIPO DE ACESSO — SELECT CUSTOMIZADO
          ================================================== */}

          <div ref={selectRef}>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Tipo de acesso
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSelectOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={selectOpen}
                className={`
                  flex h-10 w-full items-center gap-2
                  rounded-xl
                  border
                  bg-surface-sidebar
                  px-3
                  text-left
                  outline-none
                  transition-all
                  ${
                    selectOpen
                      ? "border-brand-500/50 ring-2 ring-brand-500/10"
                      : "border-surface-border hover:border-slate-600"
                  }
                `}
              >
                <div
                  className={`
                    flex h-6 w-6 shrink-0 items-center justify-center
                    rounded-lg
                    ${
                      selectOpen
                        ? "bg-brand-500/10 text-brand-400"
                        : "bg-surface-panel text-slate-500"
                    }
                  `}
                >
                  <SelectedIcon size={13} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-white">
                    {selectedOption.label}
                  </p>

                  <p className="truncate text-[9px] text-slate-500">
                    {selectedOption.description}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className={`
                    shrink-0 text-slate-500
                    transition-transform duration-200
                    ${selectOpen ? "rotate-180 text-brand-400" : ""}
                  `}
                />
              </button>

              {/* DROPDOWN */}

              <AnimatePresence>
                {selectOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.15,
                      ease: "easeOut",
                    }}
                    className="
                      absolute left-0 right-0 top-[calc(100%+6px)]
                      z-[100]
                      overflow-hidden
                      rounded-xl
                      border border-surface-border
                      bg-surface-sidebar
                      p-1
                      shadow-2xl
                    "
                    role="listbox"
                  >
                    {registrationOptions.map((option) => {
                      const OptionIcon = option.icon;

                      const isSelected = option.value === registrationType;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() =>
                            handleRegistrationTypeChange(option.value)
                          }
                          className={`
                            flex w-full items-center gap-2.5
                            rounded-lg
                            px-2.5 py-2
                            mb-1
                            text-left
                            transition-colors
                            ${
                              isSelected
                                ? "bg-brand-500/10"
                                : "hover:bg-surface-panel"
                            }
                          `}
                        >
                          <div
                            className={`
                              flex h-7 w-7 shrink-0
                              items-center justify-center
                              rounded-lg
                              border
                              ${
                                isSelected
                                  ? "border-brand-500/20 bg-brand-500/10 text-brand-400"
                                  : "border-surface-border bg-surface-panel text-slate-500"
                              }
                            `}
                          >
                            <OptionIcon size={14} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`
                                text-[10px] font-semibold
                                ${isSelected ? "text-brand-400" : "text-white"}
                              `}
                            >
                              {option.label}
                            </p>

                            <p className="mt-0.5 text-[9px] text-slate-500">
                              {option.description}
                            </p>
                          </div>

                          {isSelected && (
                            <Check
                              size={14}
                              className="shrink-0 text-brand-400"
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ===================================================
            EMPRESA / CONVITE
        ==================================================== */}

        {registrationType === "create_company" ? (
          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Nome da empresa
            </label>

            <div className="relative">
              <Building2
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="company"
                type="text"
                required
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Ex.: Studio Smart"
                className="
                  h-10 w-full rounded-xl
                  border border-surface-border
                  bg-surface-sidebar
                  pl-9 pr-3
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />
            </div>

            <p className="mt-1 text-[9px] text-slate-600">
              Você será o proprietário e poderá convidar colaboradores.
            </p>
          </div>
        ) : (
          <div>
            <label
              htmlFor="invite-code"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Código de convite
            </label>

            <div className="relative">
              <Users
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="invite-code"
                type="text"
                required
                maxLength={10}
                value={inviteCode}
                onChange={(event) =>
                  setInviteCode(event.target.value.toUpperCase())
                }
                placeholder="Ex.: ABC123"
                className="
                  h-10 w-full rounded-xl
                  border border-surface-border
                  bg-surface-sidebar
                  pl-9 pr-3
                  text-xs font-semibold uppercase tracking-wider text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />
            </div>

            <p className="mt-1 text-[9px] text-slate-600">
              O código é fornecido pelo proprietário da empresa.
            </p>
          </div>
        )}

        {/* ===================================================
            EMAIL + SENHA
        ==================================================== */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* EMAIL */}

          <div>
            <label
              htmlFor="register-email"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              E-mail
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@empresa.com"
                className="
                  h-10 w-full rounded-xl
                  border border-surface-border
                  bg-surface-sidebar
                  pl-9 pr-3
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />
            </div>
          </div>

          {/* SENHA */}

          <div>
            <label
              htmlFor="register-password"
              className="mb-1 block text-xs font-semibold text-slate-300"
            >
              Senha
            </label>

            <div className="relative">
              <Lock
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="
                  h-10 w-full rounded-xl
                  border border-surface-border
                  bg-surface-sidebar
                  pl-9 pr-10
                  text-xs text-white
                  outline-none
                  placeholder:text-slate-600
                  transition-all
                  focus:border-brand-500/60
                  focus:ring-2
                  focus:ring-brand-500/10
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="
                  absolute right-3 top-1/2
                  -translate-y-1/2
                  text-slate-500
                  transition-colors
                  hover:text-slate-300
                "
              >
                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================
            BENEFÍCIOS
        ==================================================== */}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
          {[
            "Dashboard financeiro",
            "Receitas e despesas",
            "DRE automatizado",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/10">
                <Check size={8} className="text-emerald-400" />
              </div>

              <span className="text-[9px] text-slate-500">{item}</span>
            </div>
          ))}
        </div>

        {/* ===================================================
            TERMOS
        ==================================================== */}

        <label className="flex items-start gap-2 pt-0.5">
          <input
            type="checkbox"
            required
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="
              mt-auto
              h-3.5
              w-3.5
              shrink-0
              rounded
              border-surface-border
              bg-surface-sidebar
              accent-brand-500
            "
          />

          <span className="text-[9px] leading-tight text-slate-500">
            Concordo com os termos de uso e com a política de privacidade do
            MetricsFlow AI.
          </span>
        </label>

        {/* ===================================================
            SUBMIT
        ==================================================== */}

        <button
          type="submit"
          disabled={loading || googleLoading || !acceptedTerms}
          className="
            flex h-10 w-full items-center
            justify-center gap-2
            rounded-xl
            bg-brand-600
            text-xs font-semibold text-white
            shadow-lg shadow-brand-600/20
            transition-all
            hover:bg-brand-500
            hover:shadow-brand-500/25
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Criando conta...
            </>
          ) : (
            <>
              {registrationType === "create_company"
                ? "Criar minha conta"
                : "Criar conta e entrar"}

              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* =====================================================
          GOOGLE
      ====================================================== */}

      <div className="relative my-3.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-border" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-surface-main px-3 text-[9px] text-slate-600">
            ou continue com
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={loading || googleLoading || !acceptedTerms}
        className="
          flex h-10 w-full items-center
          justify-center gap-2
          rounded-xl
          border border-surface-border
          bg-surface-sidebar
          text-xs font-semibold text-slate-200
          transition-all
          hover:border-slate-600
          hover:bg-surface-panel
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {googleLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <GoogleIcon />
        )}

        {googleLoading ? "Conectando..." : "Continuar com Google"}
      </button>

      {/* =====================================================
          LOGIN
      ====================================================== */}

      <div className="mt-3 border-t border-surface-border pt-3 text-center">
        <p className="text-[10px] text-slate-500">
          Já possui uma conta?{" "}
          <Link
            href="/login"
            className="
              font-semibold
              text-brand-400
              transition-colors
              hover:text-brand-300
            "
          >
            Entrar na plataforma
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.23-2.28H12v4.31h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />

      <path
        fill="#34A853"
        d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.75a5.85 5.85 0 0 1 0-3.5V7.72H3.3a9.74 9.74 0 0 0 0 8.56l3.24-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.22c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z"
      />
    </svg>
  );
}
