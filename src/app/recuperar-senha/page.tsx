import Link from "next/link";
import { Lock } from "lucide-react";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function RecuperarSenhaPage() {
  return (
    <main className="min-h-screen bg-surface-main text-white">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="
                inline-flex items-center gap-2
                transition-opacity
                hover:opacity-80
              "
            >
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  border border-brand-500/20
                  bg-brand-500/10
                "
              >
                <Lock size={18} className="text-brand-400" />
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className="
                    font-heading text-lg font-bold
                    tracking-tight text-white
                  "
                >
                  MetricsFlow
                </span>

                <span
                  className="
                    rounded-md
                    border border-brand-500/20
                    bg-brand-500/10
                    px-1.5 py-0.5
                    text-[9px]
                    font-bold
                    text-brand-400
                  "
                >
                  AI
                </span>
              </div>
            </Link>
          </div>

          {/* CARD */}
          <div
            className="
              rounded-2xl
              border border-surface-border
              bg-surface-sidebar/80
              p-6
              shadow-2xl shadow-black/20
              backdrop-blur-xl
            "
          >
            <ForgotPasswordForm />
          </div>

          <p className="mt-5 text-center text-[10px] text-slate-600">
            © {new Date().getFullYear()} MetricsFlow AI
          </p>
        </div>
      </div>
    </main>
  );
}
