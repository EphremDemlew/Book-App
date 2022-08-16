alter table "public"."shopping_session"
  add constraint "shopping_session_book_id_fkey"
  foreign key ("book_id")
  references "public"."books"
  ("id") on update restrict on delete restrict;
