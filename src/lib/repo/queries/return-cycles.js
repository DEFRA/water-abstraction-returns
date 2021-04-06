'use strict';

exports.returnCycleStatsReport = `
select * from returns.return_cycles c
left join (
  select 
    r.return_cycle_id,
    count(*) as total_count,
    count(*) filter (where status='due') as due_count,
    count(*) filter (where status='completed') as completed_count,
    count(*) filter (where status='received') as received_count,
    count(*) filter (where status='void') as void_count,
    count(*) filter (where returns_frequency='day') as daily_count,
    count(*) filter (where returns_frequency='week') as weekly_count,
    count(*) filter (where returns_frequency='month') as monthly_count,
    count(distinct licence_ref) as unique_licence_count
  from returns.returns r
  where r.return_cycle_id in (
    select return_cycle_id 
      from returns.return_cycles c
      where c.start_date>=$1
    )
  group by r.return_cycle_id
) r
on c.return_cycle_id=r.return_cycle_id
where c.start_date>=$1 
order by c.start_date;
`;

exports.upsert = `
insert into returns.return_cycles (
  start_date, end_date, due_date,
  is_summer, is_submitted_in_wrls, date_created
)
values (
  $1, $2, $2::date + interval '28 day',
  $3, $2 >= '2018-10-31'::date, now()
)
on conflict (start_date, end_date, is_summer)
  do update set date_updated=now()
  returning *;
`;

exports.getReturnCycle = `
select * from returns.return_cycles where return_cycle_id=$1
`;

exports.getReturnCycleReturns = `
select 
r.return_id,
r.licence_ref,
r.return_requirement,
r.created_at,
r.returns_frequency,
r.start_date, 
r.end_date,
r.due_date,
r.received_date,
r.status,
v.user_id,
v.user_type
from returns.returns r 
left join (
  select * from returns.versions v
  where v.current=true
) v on r.return_id=v.return_id
where r.return_cycle_id=$1
`;
