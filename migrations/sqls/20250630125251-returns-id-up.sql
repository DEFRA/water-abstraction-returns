ALTER TABLE "returns"."returns" ADD COLUMN id UUID DEFAULT gen_random_uuid();

UPDATE "returns"."returns" SET id = gen_random_uuid();

ALTER TABLE "returns"."returns" ALTER COLUMN id SET NOT NULL;
