ALTER TABLE returns ADD COLUMN id UUID DEFAULT gen_random_uuid();

UPDATE returns SET id = gen_random_uuid();

ALTER TABLE returns ALTER COLUMN id SET NOT NULL;
