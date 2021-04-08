-- Create current cycle - it should already be present
insert into returns.return_cycles (
  start_date,
  end_date,
  due_date,
  is_summer, 
  is_submitted_in_wrls,
  date_created
)
values 
  ('2020-04-01', '2021-03-31', '2021-04-28', false, true, NOW())
on conflict (start_date, end_date, is_summer) 
  do nothing;

-- Assign each return to a cycle ID
update returns.returns 
  set return_cycle_id=c.return_cycle_id 
  from (
    select r.return_id, c.return_cycle_id 
    from returns.returns r
    join returns.return_cycles c 
      on r.start_date>= c.start_date 
      and r.end_date<= c.end_date 
      and (r.metadata->>'isSummer')::boolean=c.is_summer
    where r.start_date>='2008-04-01'
  ) c
  where returns.return_id=c.return_id;
