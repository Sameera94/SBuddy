#!/bin/bash
USERNAME="sameera"
HOSTS="192.168.8.102"
SCRIPT="sameera; ls"
RESULT=ssh -l ${USERNAME} ${HOSTNAME} "${SCRIPT}"
echo "${RESULT}"