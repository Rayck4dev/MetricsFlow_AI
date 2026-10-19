import { FileSpreadsheet } from "lucide-react";

export function ForMeiBottomMessage() {
  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-2 text-[10px] text-slate-600">
        <FileSpreadsheet size={13} aria-hidden="true" />
        <span>Menos planilhas. Mais clareza sobre o seu negócio.</span>
      </div>
    </div>
  );
}
