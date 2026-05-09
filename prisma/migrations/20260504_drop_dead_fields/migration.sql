-- Drop 4 redundant columns from Listing table
ALTER TABLE `Listing` DROP COLUMN `country`;
ALTER TABLE `Listing` DROP COLUMN `salaryCurrency`;
ALTER TABLE `Listing` DROP COLUMN `isPredictedSalary`;
ALTER TABLE `Listing` DROP COLUMN `isUrgent`;
