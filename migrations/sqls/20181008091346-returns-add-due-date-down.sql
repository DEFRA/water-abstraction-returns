alter table "returns"."returns" drop constraint unique_return;

alter table returns.returns
  drop column due_date;

alter table "returns"."returns"
add constraint unique_return unique (regime, licence_type, licence_ref, start_date, end_date, return_requirement);

