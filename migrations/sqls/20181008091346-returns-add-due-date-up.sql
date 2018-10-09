
alter table returns.returns
  add column due_date date;

-- set the due_date to the last day of the next month
update returns.returns
set due_date = (date_trunc('month', end_date) + interval '2 month' - interval '1 day')::date;

-- all future rows should have a due date
alter table returns.returns
  alter column due_date set not null;
