/* Replace with your SQL commands */

alter table returns.returns 
  drop column return_cycle_id; 

truncate table returns.return_cycles;

drop table return_cycles;

