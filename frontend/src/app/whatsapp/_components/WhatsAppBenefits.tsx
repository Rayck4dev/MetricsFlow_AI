import { motion } from "framer-motion";
import { ClipboardCheck, MessageCircle, Wallet } from "lucide-react";

const benefits = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Fale naturalmente",
    description:
      "Descreva uma venda ou despesa com suas próprias palavras, como em uma conversa.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Confira os detalhes",
    description:
      "Veja as informações identificadas e revise os dados antes de confirmar.",
  },
  {
    icon: Wallet,
    number: "03",
    title: "Organize suas finanças",
    description:
      "Conheça a proposta de registrar suas movimentações de forma simples e prática.",
  },
];

export function WhatsAppBenefits() {
  return (
<section className="mt-12 sm:mt-14">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-emerald-300">
                    Simples por natureza
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    Menos etapas. Mais clareza.
                  </h2>
                </div>

                <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
                  Conheça o fluxo proposto antes de experimentar a demonstração.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;

                  return (
                    <motion.article
                      key={benefit.number}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                      }}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#061b2b]/75 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-[#082033]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-300 transition group-hover:bg-emerald-400/[0.12]">
                          <Icon size={20} />
                        </div>

                        <span className="text-xs font-medium tracking-wider text-slate-700">
                          {benefit.number}
                        </span>
                      </div>

                      <h3 className="mt-5 text-base font-semibold text-white">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {benefit.description}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </section>
  );
}
