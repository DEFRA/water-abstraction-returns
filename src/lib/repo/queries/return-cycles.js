'use strict';

exports.returnCycleStatsReport = `
select 
  r.return_cycle_id,
  r.start_date,
  r.end_date,
  r.due_date,
  r.is_summer,
  count(*) as total_count,
  count(*) filter (where status='due') as due_count,
  count(*) filter (where status='completed') as completed_count,
  count(*) filter (where status='received') as received_count,
  count(*) filter (where status='void') as void_count,
  count(*) filter (where returns_frequency='day') as daily_count,
  count(*) filter (where returns_frequency='week') as weekly_count,
  count(*) filter (where returns_frequency='month') as monthly_count,
  count(distinct licence_ref) as unique_licence_count,
  count(*) filter (where status='completed' and is_digital=true) as completed_digital_count,
  count(*) filter (where status='completed' and is_digital=false) as completed_non_digital_count,
  count(*) filter (where status='completed' and is_digital=true and is_on_time=true) as completed_digital_on_time_count,
    count(*) filter (where status='completed' and is_digital=true and is_on_time=false) as completed_digital_late_count,
  count(*) filter (where status='completed' and is_digital=false and is_on_time=true) as completed_non_digital_on_time_count,
    count(*) filter (where status='completed' and is_digital=false and is_on_time=false) as completed_non_digital_late_count
from (
  select 
    rc.*,  
    r.status, 
    r.returns_frequency, 
    r.licence_ref, 
    r.received_date<=r.due_date as is_on_time,
    v.user_type='external' as is_digital
  from returns.return_cycles rc
    left join returns.returns r
      on rc.return_cycle_id=r.return_cycle_id
    left join returns.versions v 
      on r.return_id=v.return_id and v.current=true 
   where rc.start_date>=$1
) r
group by r.return_cycle_id, r.start_date, r.end_date, r.due_date, r.is_summer
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
