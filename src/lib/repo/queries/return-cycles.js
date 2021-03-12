'use strict';

exports.returnCycleReport = `
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
  where r.return_cycle_id is not null
  group by r.return_cycle_id
) r
on c.return_cycle_id=r.return_cycle_id
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
