#!/bin/bash


EMULATOR="@Nexus_5X_API_23"

case "$1" in
    "4.4")
    EMULATOR="@5.4_FWVGA_API_19"
    ;;
    "5.1")
    EMULATOR="@Nexus_5X_API_22"
    ;;
    "6")
    EMULATOR="@Nexus_5X_API_23"
    ;;
    "7")
    EMULATOR="@Nexus_5X_API_25"
    ;;
    "8")
    #EMULATOR="@Pixel_2_API_26"
    EMULATOR="@Nexus_5X_API_26"
    ;;
    "8.1")
    EMULATOR="@Nexus_5X_API_27"
    ;;
    "9")
    EMULATOR="@Nexus_5X_API_28"
    ;;
esac


/home/andrew/Android/Sdk/tools/emulator "$EMULATOR" &


# android 8.0
#/home/andrew/Android/Sdk/tools/emulator @Pixel_2_API_26 &

# android 7.1.1
#/home/andrew/Android/Sdk/tools/emulator @Nexus_5X_API_25 &

# android 6.0
#/home/andrew/Android/Sdk/tools/emulator @Nexus_5X_API_23 &

# android 5.1
#/home/andrew/Android/Sdk/tools/emulator @Nexus_5X_API_22 &

# android 4.4
#/home/andrew/Android/Sdk/tools/emulator @5.4_FWVGA_API_19 &