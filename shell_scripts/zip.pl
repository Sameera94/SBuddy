#!/usr/bin/perl

use warnings;
use strict;
use Net::FTP;



my $host = "192.168.8.102";
my $username = "sameera";
my $password = "sameera";
my $ftpdir = "/home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount";
my $file = "app.js";
 
#-- connect to ftp server
my $ftp = Net::FTP->new($host) or die "Error connecting to $host: $!";
 
#-- login
$ftp->login($username,$password) or die "Login failed: $!";



$ftp->cwd("/home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount"),"\n";
print $ftp->ls("/home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount"),"\n\n\n\n";   

# $ftp->site("mkdir /home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount/bbbbbbb") or die "Error cd";
# $ftp->site("mkdir xxx") or die "Error mkdr";
