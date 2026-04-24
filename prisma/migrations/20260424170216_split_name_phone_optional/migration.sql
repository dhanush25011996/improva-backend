-- Add new columns for split name
ALTER TABLE `tickets`
    ADD COLUMN `passenger_first_name` VARCHAR(80) NULL,
    ADD COLUMN `passenger_last_name`  VARCHAR(80) NULL;

-- Backfill first/last name from existing full name (best-effort split on first space)
UPDATE `tickets`
SET
    `passenger_first_name` = SUBSTRING_INDEX(`passenger_name`, ' ', 1),
    `passenger_last_name`  = IF(
        INSTR(`passenger_name`, ' ') > 0,
        SUBSTRING(`passenger_name`, INSTR(`passenger_name`, ' ') + 1),
        ''
    )
WHERE `passenger_name` IS NOT NULL;

-- Drop the legacy column
ALTER TABLE `tickets` DROP COLUMN `passenger_name`;
