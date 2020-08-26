alter table returns.returns
  add column is_test boolean default false not null;

update returns.returns set is_test=true where source='acceptance-test-setup';