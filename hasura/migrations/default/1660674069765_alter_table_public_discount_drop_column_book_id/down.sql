alter table "public"."discount" alter column "book_id" drop not null;
alter table "public"."discount" add column "book_id" uuid;
