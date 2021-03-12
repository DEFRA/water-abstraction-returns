-- Create a table to hold return cycles
create table returns.return_cycles (
  return_cycle_id uuid default gen_random_uuid() primary key,
  start_date date not null,
  end_date date not null,
  due_date date not null,
  is_summer boolean not null,
  is_submitted_in_wrls boolean not null,
  date_created timestamp without time zone NOT NULL DEFAULT now(),
  date_updated timestamp without time zone NOT NULL DEFAULT now()
);

-- Create cycles starting when WRLS can show returns (2008-04-01 onwards)
insert into returns.return_cycles (
  start_date,
  end_date,
  due_date,
  is_summer, 
  is_submitted_in_wrls,
  date_created
)
values 
  ('2008-04-01', '2009-03-31', '2009-04-28', false, false, NOW()),
  ('2008-11-01', '2009-10-31', '2009-11-28', true, false, NOW()),
  ('2009-04-01', '2010-03-31', '2010-04-28', false, false, NOW()),
  ('2009-11-01', '2010-10-31', '2010-11-28', true, false, NOW()),
  ('2010-04-01', '2011-03-31', '2011-04-28', false, false, NOW()),
  ('2010-11-01', '2011-10-31', '2011-11-28', true, false, NOW()),
  ('2011-04-01', '2012-03-31', '2012-04-28', false, false, NOW()),
  ('2011-11-01', '2012-10-31', '2012-11-28', true, false, NOW()),
  ('2012-04-01', '2013-03-31', '2013-04-28', false, false, NOW()),
  ('2012-11-01', '2013-10-31', '2013-11-28', true, false, NOW()),
  ('2013-04-01', '2014-03-31', '2014-04-28', false, false, NOW()),
  ('2013-11-01', '2014-10-31', '2014-11-28', true, false, NOW()),
  ('2014-04-01', '2015-03-31', '2015-04-28', false, false, NOW()),
  ('2014-11-01', '2015-10-31', '2015-11-28', true, false, NOW()),
  ('2015-04-01', '2016-03-31', '2016-04-28', false, false, NOW()),
  ('2015-11-01', '2016-10-31', '2016-11-28', true, false, NOW()),
  ('2016-04-01', '2017-03-31', '2017-04-28', false, false, NOW()),
  ('2016-11-01', '2017-10-31', '2017-11-28', true, false, NOW()),
  ('2017-04-01', '2018-03-31', '2018-04-28', false, false, NOW()),
  ('2017-11-01', '2018-10-31', '2018-11-28', true, true, NOW()),
  ('2018-04-01', '2019-03-31', '2019-04-28', false, true, NOW()),
  ('2018-11-01', '2019-10-31', '2019-11-28', true, true, NOW()),
  ('2019-04-01', '2020-03-31', '2020-10-16', false, true, NOW()),
  ('2019-11-01', '2020-10-31', '2020-11-28', true, true, NOW());

alter table returns.returns 
  add column return_cycle_id uuid 
  references returns.return_cycles(return_cycle_id);

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
  ) c;

