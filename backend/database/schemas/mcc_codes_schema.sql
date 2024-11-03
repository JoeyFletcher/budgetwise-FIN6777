CREATE TABLE IF NOT EXISTS mcc_codes
(
    mcc                integer not null primary key,
    expense_type       text,
    budget_bucket_code integer
);

alter table mcc_codes
    owner to "main-system";