alter table "public"."cart_item"
  add constraint "cart_item_session_id_fkey"
  foreign key (session_id)
  references "public"."shopping_session"
  (id) on update restrict on delete no action;
alter table "public"."cart_item" alter column "session_id" drop not null;
alter table "public"."cart_item" add column "session_id" uuid;
