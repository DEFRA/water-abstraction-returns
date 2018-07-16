-- Table: returns.returns

-- DROP TABLE returns.returns;

CREATE TABLE returns.returns
(
    return_id character varying COLLATE pg_catalog."default" NOT NULL,
    regime character varying COLLATE pg_catalog."default" NOT NULL,
    licence_type character varying COLLATE pg_catalog."default" NOT NULL,
    licence_ref character varying COLLATE pg_catalog."default" NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    returns_frequency character varying COLLATE pg_catalog."default" NOT NULL,
    status character varying COLLATE pg_catalog."default" NOT NULL,
    source character varying COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT returns_pkey PRIMARY KEY (return_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE returns.returns
    OWNER to postgres;


-- Table: returns.versions

-- DROP TABLE returns.versions;

CREATE TABLE returns.versions
(
    version_id character varying COLLATE pg_catalog."default" NOT NULL,
    return_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_type character varying COLLATE pg_catalog."default" NOT NULL,
    version_number integer NOT NULL,
    metadata jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    nil_return boolean NOT NULL,
    CONSTRAINT versions_pkey PRIMARY KEY (version_id),
    CONSTRAINT return_id FOREIGN KEY (return_id)
        REFERENCES returns.returns (return_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE returns.versions
    OWNER to postgres;

-- Index: fki_return_id

-- DROP INDEX returns.fki_return_id;

CREATE INDEX fki_return_id
    ON returns.versions USING btree
    (return_id COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Table: returns.lines

-- DROP TABLE returns.lines;

CREATE TABLE returns.lines
(
    line_id character varying COLLATE pg_catalog."default" NOT NULL,
    version_id character varying COLLATE pg_catalog."default" NOT NULL,
    substance character varying COLLATE pg_catalog."default" NOT NULL,
    quantity numeric,
    unit character varying COLLATE pg_catalog."default" NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    time_period character varying COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    CONSTRAINT lines_pkey PRIMARY KEY (line_id),
    CONSTRAINT version_id FOREIGN KEY (version_id)
        REFERENCES returns.versions (version_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE returns.lines
    OWNER to postgres;

-- Index: fki_version_id

-- DROP INDEX returns.fki_version_id;

CREATE INDEX fki_version_id
    ON returns.lines USING btree
    (version_id COLLATE pg_catalog."default")
    TABLESPACE pg_default;
