

CREATE TABLE IF NOT EXISTS urls(
    shortCode VARCHAR(7) NOT NULL PRIMARY KEY,
    targetUrl LONGTEXT NOT NULL,
    createdAt DATETIME,
    accessCount INT,
    sequenceId INT UNIQUE NOT NULL
);


CREATE INDEX sequence_id on urls(sequenceId);

