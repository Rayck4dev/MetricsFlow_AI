export function formatMoney(value: number | null) {
  if (value == null) {
    return "Não informado";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDatePtBr(value: string | null) {
  if (!value) {
    return "Não informada";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "Não informada";
  }

  return `${day}/${month}/${year}`;
}

export const WHATSAPP_EXAMPLES = [
  {
    label: "Venda",
    text: "Recebi 850 reais de uma venda hoje por Pix",
  },
  {
    label: "Combustível",
    text: "Gastei 120 reais de gasolina hoje no Pix",
  },
  {
    label: "Internet",
    text: "Paguei 89 reais de internet hoje",
  },
] as const;

export function getWhatsAppStatusLabel(
  status: "pending" | "verified" | "disabled",
) {
  switch (status) {
    case "verified":
      return "Conectado";

    case "pending":
      return "Aguardando verificação";

    case "disabled":
      return "Desativado";

    default:
      return "Não conectado";
  }
}
