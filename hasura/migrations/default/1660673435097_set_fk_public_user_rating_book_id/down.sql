alter table "public"."user_rating" drop constraint "user_rating_book_id_fkey",
  add constraint "rating_book_id_fkey"
  foreign key ("book_id")
  references "public"."books"
  ("id") on update restrict on delete restrict;
