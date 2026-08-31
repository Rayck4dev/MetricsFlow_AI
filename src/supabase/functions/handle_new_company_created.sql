-- MetricsFlow AI
-- Função fornecida no schema do projeto.

CREATE OR REPLACE FUNCTION public.handle_new_company_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO categories (company_id, name, type, color, is_default)
  VALUES
    (NEW.id, 'Vendas / Produtos', 'income', '#10B981', TRUE),
    (NEW.id, 'Prestação de Serviços', 'income', '#06B6D4', TRUE),
    (NEW.id, 'Outras Receitas', 'income', '#64748B', TRUE),
    (NEW.id, 'Fornecedores / Estoque', 'expense', '#F43F5E', TRUE),
    (NEW.id, 'Aluguel / Água / Luz', 'expense', '#EF4444', TRUE),
    (NEW.id, 'Marketing / Anúncios', 'expense', '#F97316', TRUE),
    (NEW.id, 'DAS / Impostos MEI', 'expense', '#A855F7', TRUE),
    (NEW.id, 'Ferramentas / Sistema', 'expense', '#3B82F6', TRUE),
    (NEW.id, 'Outras Despesas', 'expense', '#64748B', TRUE);

  RETURN NEW;
END;
$$;

