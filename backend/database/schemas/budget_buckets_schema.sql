CREATE TABLE IF NOT EXISTS budget_buckets
(
    budget_bucket_code integer not null primary key,
    expense_type       text
);

alter table budget_buckets
    owner to "main-system";