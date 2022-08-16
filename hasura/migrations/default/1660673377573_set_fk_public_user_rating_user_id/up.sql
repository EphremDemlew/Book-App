alter table "public"."user_rating" drop constraint "rating_user_id_fkey",
  add constraint "user_rating_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete restrict;
