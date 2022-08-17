alter table "public"."account" alter column "balance" drop not null;
alter table "public"."account" add column "balance" numeric;
