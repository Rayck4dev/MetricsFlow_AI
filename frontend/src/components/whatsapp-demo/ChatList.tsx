"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Check,
  MessageSquarePlus,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import type { DemoConversation } from "@/types/whatsapp-demo";
import { BotAvatar, FakeAvatar } from "./BotAvatar";

type Props = {
  conversations: DemoConversation[];
  activeId: number;
  search: string;
  onSearch: (v: string) => void;
  onSelect: (id: number) => void;
};

const FILTERS = ["Tudo", "Não lidas", "Favoritas", "Grupos"];

export function ChatList({
  conversations,
  activeId,
  search,
  onSearch,
  onSelect,
}: Props) {
  const [filter, setFilter] = useState("Tudo");
  const [listWidth, setListWidth] = useState<"compact" | "normal" | "wide">(
    "normal",
  );

  const widthClass = {
    compact: "md:w-[300px] xl:w-[320px]",
    normal: "md:w-[340px] xl:w-[360px]",
    wide: "md:w-[400px] xl:w-[440px]",
  }[listWidth];
  const visible = conversations.filter(
    (c) => filter !== "Não lidas" || c.unread,
  );

  return (
    <section
      className={`flex h-full w-full shrink-0 flex-col border-r border-white/[0.07] bg-[#161717] transition-[width] duration-200 ${widthClass}`}
    >
      <div className="flex items-center justify-between pb-1.5 pl-5 pr-4 pt-3.5">
        <h1 className="text-[22px] font-bold tracking-tight">Conversas</h1>
        <div className="flex gap-0.5">
          <button
            aria-label="Alterar largura da lista"
            title={`Largura: ${listWidth === "compact" ? "compacta" : listWidth === "normal" ? "padrão" : "expandida"}`}
            onClick={() =>
              setListWidth((current) =>
                current === "compact"
                  ? "normal"
                  : current === "normal"
                    ? "wide"
                    : "compact",
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#c8cfd1] hover:bg-white/[0.07]"
          >
            {listWidth === "wide" ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>
      </div>

      <label className="mx-3 mb-1 mt-2 flex h-10 items-center gap-3 rounded-full bg-[#242626] px-3.5 text-[#8f9a9d]">
        <Search size={19} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Pesquisar ou começar uma nova conversa"
          className="flex-1 bg-transparent text-[14px] text-[#e9edef] outline-none placeholder:text-[#8f9a9d]"
        />
      </label>

      <div className="flex gap-2 overflow-hidden px-3 pb-2.5 pt-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 whitespace-nowrap rounded-full border px-3 text-[14px] ${
              filter === f
                ? "border-[#0f3d28] bg-[#0f3d28] text-[#6fe3a0]"
                : "border-white/[0.09] text-[#8f9a9d] hover:bg-white/[0.05]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 [scrollbar-color:#3a3d3d_transparent] [scrollbar-width:thin]">
        {visible.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex h-[72px] w-full items-center gap-3.5 rounded-xl px-3 text-left ${activeId === c.id ? "bg-[#2b2d2d]" : "hover:bg-[#202222]"}`}
          >
            {c.isBot ? <BotAvatar size={49} /> : <FakeAvatar hue={c.hue} />}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`flex items-center gap-1.5 truncate text-[17px] ${c.isBot ? "" : "select-none blur-[5px]"}`}
                >
                  {c.name}
                  {c.isBot && (
                    <BadgeCheck size={16} className="shrink-0 text-[#21c063]" />
                  )}
                </span>
                <span
                  className={`shrink-0 text-xs ${c.unread ? "text-[#21c063]" : "text-[#8f9a9d]"}`}
                >
                  {c.time}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[#8f9a9d]">
                <span
                  className={`truncate text-[14px] ${c.isBot ? "" : "select-none blur-[5px]"}`}
                >
                  {c.preview}
                </span>
                {!!c.unread && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#21c063] px-1.5 text-xs font-semibold text-[#0b1f13]">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
