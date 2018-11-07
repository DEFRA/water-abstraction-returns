/* Replace with your SQL commands */
alter table returns.returns
  add column under_query boolean default false not null;


alter table returns.returns
  add column under_query_comment character varying;
