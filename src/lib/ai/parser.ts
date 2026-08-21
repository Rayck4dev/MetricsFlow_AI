// Estrutura reservada para a integração da API do Gemini / OpenAI na Task 3.3
export async function parseWhatsAppMessage(messageText: string) {
  // Exemplo de retorno estruturado
  return {
    descricao: messageText,
    valor: 0,
    tipo: "despesa",
    categoria: "Geral",
  };
}
