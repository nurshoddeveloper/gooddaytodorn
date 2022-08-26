#!/bin/bash

TEXT_PRESENT="_\.\w"
TEXT_ABSENT="lodash"

ack "$TEXT_PRESENT" -l > _1_temp.txt
ack --files-from ./_1_temp.txt -Q "$TEXT_ABSENT" -L
rm _1_temp.txt

