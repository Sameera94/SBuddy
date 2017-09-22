-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 22, 2017 at 05:43 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seo_buddy`
--

-- --------------------------------------------------------

--
-- Table structure for table `file_monitor_main`
--

CREATE TABLE `file_monitor_main` (
  `id` int(11) NOT NULL,
  `file_name` varchar(200) NOT NULL,
  `original_path` varchar(500) NOT NULL,
  `original_file` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `file_monitor_main`
--

INSERT INTO `file_monitor_main` (`id`, `file_name`, `original_path`, `original_file`) VALUES
(1, 'editor.html', 'home/editor.html', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/OriginalBackup/AdminMaria_Backup/AdminMaria/home/editor.html'),
(2, 'conf.js', 'conf.js', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/OriginalBackup/AdminMaria_Backup/AdminMaria/conf.js'),
(3, 'editor.html', 'editor.html', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/OriginalBackup/AdminMaria_Backup/AdminMaria/editor.html'),
(4, 'style.css', 'app/style.css', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/OriginalBackup/AdminMaria_Backup/AdminMaria/app/style.css');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `file_monitor_main`
--
ALTER TABLE `file_monitor_main`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `file_monitor_main`
--
ALTER TABLE `file_monitor_main`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
