-- AfterTime Calendar Database Schema

-- Table structure for tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `task_date` date NOT NULL,
  `task_time` time DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `task_date_index` (`task_date`),
  KEY `user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Table structure for users if you want user-specific tasks
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Sample data for testing
INSERT INTO `tasks` (`title`, `description`, `task_date`, `task_time`) VALUES
('Team Meeting', 'Weekly team sync-up to discuss project progress', '2025-09-15', '10:00:00'),
('Dentist Appointment', 'Regular checkup', '2025-09-18', '14:30:00'),
('Submit Project Report', 'Finalize and submit Q3 project report to management', '2025-09-20', '17:00:00'),
('Gym Session', 'Cardio and strength training', '2025-09-12', '18:00:00'),
('Call Mom', 'Weekly family call', '2025-09-14', '19:30:00');

-- Add more tables as needed for your application
-- For example: categories, task_categories, etc.
