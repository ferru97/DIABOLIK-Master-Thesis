#!/usr/bin/expect
spawn chainlink admin login
expect "Enter email:" 
send "user@example.com\n";
expect "Enter password:"
send "password\n";
interact
