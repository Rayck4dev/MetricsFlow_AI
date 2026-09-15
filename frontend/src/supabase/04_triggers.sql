-- MetricsFlow AI

-- ================================================================
-- NOVA EMPRESA -> CATEGORIAS PADRÃO
-- ================================================================
DROP TRIGGER IF EXISTS trigger_seed_company_categories ON public.companies;

CREATE TRIGGER trigger_seed_company_categories
AFTER INSERT ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_company_created();


-- ================================================================
-- UPDATED_AT
-- ================================================================

DROP TRIGGER IF EXISTS trigger_companies_updated_at ON public.companies;
CREATE TRIGGER trigger_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trigger_transactions_updated_at ON public.transactions;
CREATE TRIGGER trigger_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- ================================================================
-- AUTH.USERS -> PROFILE
-- ================================================================
-- Este trigger precisa ser criado no schema auth.
-- Execute apenas se o projeto estiver usando a função handle_new_user.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
after INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- NOVA TRANSAÇÃO
-- =========================================================

drop trigger if exists trigger_notify_transaction_created
on public.transactions;

create trigger trigger_notify_transaction_created
after insert
on public.transactions
for each row
execute function public.notify_transaction_created();

-- =========================================================
-- TRANSAÇÃO ATUALIZADA
-- =========================================================

drop trigger if exists trigger_notify_transaction_updated
on public.transactions;

create trigger trigger_notify_transaction_updated
after update
on public.transactions
for each row
execute function public.notify_transaction_updated();

-- =========================================================
-- TRIGGER: TRANSAÇÃO EXCLUÍDA
-- =========================================================

drop trigger if exists trigger_notify_transaction_deleted
on public.transactions;

create trigger trigger_notify_transaction_deleted
after delete
on public.transactions
for each row
execute function public.notify_transaction_deleted();