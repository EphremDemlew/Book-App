alter table "public"."cart_item" drop constraint "cart_item_session_id_fkey",
  add constraint "cart_item_session_id_fkey"
  foreign key ("session_id")
  references "public"."shopping_session"
  ("id") on update restrict on delete no action;
