-- Initialization script to create the ngc-cms database and cms schema
-- This script will be automatically executed when the PostgreSQL container starts

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE "ngc-cms"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ngc-cms')\gexec

-- Connect to the newly created database
\c ngc-cms;

-- Create the cms schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS cms;

-- Grant necessary permissions
GRANT ALL ON SCHEMA cms TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cms TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA cms TO postgres;

-- Confirmation message
SELECT 'ngc-cms database and cms schema created successfully' as status; 