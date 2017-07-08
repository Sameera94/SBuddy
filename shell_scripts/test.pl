#!/usr/bin/perl
use strict;
use Net::FTP;
# print "Hello, Macinstruct user!\n"; 


my $host = "192.168.8.102";
my $username = "sameera";
my $password = "sameera";
my $ftpdir = "/home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount";
my $file = "app.js";
 
#-- connect to ftp server
my $ftp = Net::FTP->new($host) or die "Error connecting to $host: $!";
 
#-- login
$ftp->login($username,$password) or die "Login failed: $!";
 
#-- chdir to $ftpdir
$ftp->cwd($ftpdir) or die "Can't go to $ftpdir: $!";
 
#-- download file
$ftp->get($file) or die "Can't get $file: $!";
 
#-- close ftp connection
$ftp->quit or die "Error closing ftp connection: $!";


system ("ls -al");
