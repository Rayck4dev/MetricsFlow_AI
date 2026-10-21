import { ApiError } from "@/services/api/api-client";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Sua sessão expirou. Entre novamente.";
    if (error.status === 403)
      return "Você não tem permissão para realizar esta ação.";
    if (error.status === 413) return "O arquivo ultrapassa o limite permitido.";
    if (error.status === 415)
      return "Formato não permitido. Envie PDF, JPG ou PNG.";
  }

  if (error instanceof Error) return error.message;
  return "Não foi possível concluir a operação.";
}
