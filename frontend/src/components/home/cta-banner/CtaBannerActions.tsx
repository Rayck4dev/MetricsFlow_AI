import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CtaActions() {
  return (
    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <CreateAccountButton />
      <DemoButton />
    </div>
  );
}

function CreateAccountButton() {
  return (
    <Link
      href="/cadastro"
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-brand-600
        px-7
        py-3.5
        text-sm
        font-semibold
        text-white
        shadow-xl
        shadow-brand-600/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-brand-500
        hover:shadow-2xl
        hover:shadow-brand-500/20
        sm:w-auto
      "
    >
      Criar minha conta grátis
      <ArrowRight
        size={17}
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      />
    </Link>
  );
}

function DemoButton() {
  return (
    <Link
      href="/demo"
      className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-white/[0.08]
        bg-white/[0.03]
        px-7
        py-3.5
        text-sm
        font-semibold
        text-slate-300
        backdrop-blur-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-white/[0.14]
        hover:bg-white/[0.06]
        hover:text-white
        sm:w-auto
      "
    >
      <MessageCircle
        size={16}
        className="
          text-emerald-400
          transition-transform
          duration-300
          group-hover:scale-110
        "
      />
      Ver demonstração
    </Link>
  );
}
