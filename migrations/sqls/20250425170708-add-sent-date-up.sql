/*
  Adds sent_date to returns.returns to allow us to import the sent date from the NALD, and set the value ourselves
  in the future (once we've updated the notifications journey).
*/

ALTER TABLE "returns"."returns" ADD COLUMN sent_date date;
