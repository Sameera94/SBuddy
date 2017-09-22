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
-- Table structure for table `file_monitor_file_updates`
--

CREATE TABLE `file_monitor_file_updates` (
  `id` int(11) NOT NULL,
  `fileId` int(11) NOT NULL,
  `randomName` varchar(200) NOT NULL,
  `location` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `file_monitor_file_updates`
--

INSERT INTO `file_monitor_file_updates` (`id`, `fileId`, `randomName`, `location`) VALUES
(1, 1, 'HJmsiwGsb', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/HJmsiwGsb'),
(2, 2, 'rJaioPGjZ', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/rJaioPGjZ'),
(3, 3, 'Hy1hjPMo-', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/Hy1hjPMo-'),
(4, 3, 'SyXZ-dMi-', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/SyXZ-dMi-'),
(5, 2, 'ryE-W_foZ', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/ryE-W_foZ'),
(6, 1, 'ByrWbufs-', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/ByrWbufs-'),
(7, 4, 'r1OW-OfiW', '/Users/vchans5/Desktop/09-21/SBuddy/VersionController/Backups/r1OW-OfiW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `file_monitor_file_updates`
--
ALTER TABLE `file_monitor_file_updates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `file_monitor_file_updates`
--
ALTER TABLE `file_monitor_file_updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
