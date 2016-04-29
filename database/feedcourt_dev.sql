-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2016 at 09:41 PM
-- Server version: 10.1.8-MariaDB
-- PHP Version: 5.6.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feedcourt_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `zip_code` varchar(100) NOT NULL,
  `phone_no` varchar(100) NOT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=Active || 0=Delete or inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `country_id`, `state_id`, `city_id`, `zip_code`, `phone_no`, `email_id`, `status`) VALUES
(1, 1, 1, 1, '123213', '666666', 'sdfdsfdsf@xx', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cuisines`
--

CREATE TABLE `cuisines` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(1) NOT NULL COMMENT '1=Active || 0=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `img_name` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1=User || 2=Menu',
  `reference_id` int(11) NOT NULL COMMENT 'menu || member ',
  `added_by` int(11) NOT NULL COMMENT 'user id',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1=Active || 2=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(11) NOT NULL,
  `cuisine_id` int(11) NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `currency` char(2) NOT NULL DEFAULT 'RS',
  `unit_id` int(11) NOT NULL DEFAULT '0',
  `description` mediumtext,
  `added_by` int(11) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL COMMENT '1=Active || 0=Incative'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(10) NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `qty` int(11) NOT NULL DEFAULT '0',
  `invoice_id` varchar(255) NOT NULL,
  `menu_id` int(11) NOT NULL DEFAULT '0',
  `restaurant_id` int(11) NOT NULL DEFAULT '0',
  `order_master_id` int(11) NOT NULL DEFAULT '0',
  `ship_address_id` int(11) NOT NULL DEFAULT '0',
  `bill_address_id` int(11) NOT NULL DEFAULT '0',
  `order_date` datetime NOT NULL,
  `order_status` tinyint(1) NOT NULL COMMENT '0=cancell || 1= Delevered || 2=Processing || 3=Not-Approved'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `price`, `qty`, `invoice_id`, `menu_id`, `restaurant_id`, `order_master_id`, `ship_address_id`, `bill_address_id`, `order_date`, `order_status`) VALUES
(1, 100, 1, '#dfsafsfsaf', 0, 2, 1, 1, 1, '2016-04-18 00:00:00', 1),
(2, 1, 2, '#dfdsf', 0, 2, 2, 1, 1, '2016-04-25 00:00:00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `order_master`
--

CREATE TABLE `order_master` (
  `id` int(11) NOT NULL,
  `total_amount` float NOT NULL DEFAULT '0',
  `sub_total_amount` float NOT NULL DEFAULT '0',
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `order_date` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_master`
--

INSERT INTO `order_master` (`id`, `total_amount`, `sub_total_amount`, `customer_id`, `order_date`, `status`) VALUES
(1, 10008, 1000, 15, '2016-04-04 00:00:00', 1),
(2, 233, 230, 15, '2016-04-25 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `total_amount` float NOT NULL DEFAULT '0',
  `txn_id` varchar(255) NOT NULL,
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `order_details_id` int(11) NOT NULL DEFAULT '0',
  `payment_date` datetime NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '0=Failed | 1 Complete'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `rate` float NOT NULL DEFAULT '0',
  `rate_by` int(11) NOT NULL,
  `rate_to` int(11) NOT NULL,
  `rate_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `review_by` int(11) NOT NULL,
  `review_to` int(11) NOT NULL,
  `comment` text NOT NULL,
  `review_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL COMMENT '0=Delete || 1=Approved || 2=Not-Approved '
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_type` tinyint(1) NOT NULL DEFAULT '4' COMMENT '1=Admin|| 2=Food Court || 3=Restaurant || 4=Customer',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT 'food court id',
  `facebook_id` varchar(255) NOT NULL DEFAULT '0',
  `address_id` int(11) NOT NULL DEFAULT '0' COMMENT 'address id',
  `email` varchar(255) NOT NULL,
  `password` varchar(150) NOT NULL,
  `phone_no` varchar(20) NOT NULL,
  `total_rate` int(11) NOT NULL DEFAULT '0',
  `avg_rate` float NOT NULL DEFAULT '0',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1=Active || 0=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `user_type`, `parent_id`, `facebook_id`, `address_id`, `email`, `password`, `phone_no`, `total_rate`, `avg_rate`, `created_date`, `status`) VALUES
(2, 'achinta', 3, 15, '0', 0, 'achintax.achinta@gmail.com', '123', '3455', 0, 0, '2016-04-09 18:57:42', 0),
(14, 'SAdsadasd', 3, 15, '0', 1, 'sadsad.sdf@dsfdsf.fdgfdg', '23234', '4576657658', 0, 0, '2016-04-16 15:21:51', 0),
(15, 'asdsadsad', 1, 0, '0', 0, 'achinta.achinta@gmail.com', '123', '454', 0, 0, '2016-04-17 17:36:01', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cuisines`
--
ALTER TABLE `cuisines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_master`
--
ALTER TABLE `order_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `cuisines`
--
ALTER TABLE `cuisines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `order_master`
--
ALTER TABLE `order_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
