alter table "public"."rating"
  add constraint "rating_book_id_fkey"
  foreign key ("book_id")
  references "public"."books"
  ("id") on update restrict on delete restrict;
