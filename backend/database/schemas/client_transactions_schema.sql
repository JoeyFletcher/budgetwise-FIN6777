CREATE TABLE IF NOT EXISTS client_transactions
(
    transaction_id   integer not null
        primary key,
    transaction_date date,
    mcc_code         integer,
    detail           text,
    amount           numeric(10, 2),
    merchant_name    text,
    merchant_city    text,
    merchant_state   char(2),
    merchant_street  text,
    merchant_zip     varchar(10),
    db_cr            varchar(10),
    expense_type     text,
    account_id       varchar(10)
);

alter table client_transactions
    owner to "main-system";