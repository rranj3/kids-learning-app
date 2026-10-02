-- Seed data for Kids Learning App

-- Insert parent user
INSERT INTO users (email, password_hash, name, role) VALUES
('parent@example.com', '$2b$12$dummy_hash_placeholder', 'Rajesh Kumar', 'parent');

-- Get the parent ID (this will be the first user created)
-- We'll reference it as we create children

-- Insert children
INSERT INTO children (parent_id, name, age_band, date_of_birth, preferences) VALUES
((SELECT id FROM users WHERE email = 'parent@example.com'), 'Shreya', 'G3-G4', '2017-06-15', '{"sound": true, "theme": "light"}'),
((SELECT id FROM users WHERE email = 'parent@example.com'), 'Neel', '2yo', '2024-08-22', '{"sound": true, "theme": "light"}');

-- Sample stories will be inserted via the ingestion pipeline
-- This seed file mainly sets up the parent-child relationships
