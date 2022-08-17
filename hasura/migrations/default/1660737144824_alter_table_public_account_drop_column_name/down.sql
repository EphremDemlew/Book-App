alter table "public"."account" alter column "name" drop not null;
alter table "public"."account" add column "name" text;
