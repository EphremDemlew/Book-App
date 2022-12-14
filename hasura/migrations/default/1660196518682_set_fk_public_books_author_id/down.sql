alter table "public"."books" drop constraint "books_author_id_fkey",
  add constraint "books_author_id_fkey"
  foreign key ("author_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
