#!/bin/bash

KEY="AAAAiRiij2o:APA91bHxLzVRax0ynGzGlPV0RIW_R4Qfy8xtJiUi1q-2XAo4X_txYZL6BdaKxjBga7MJ1ejwignPFTwgewh_efJO9dH5T3fH0TTy1FcuKNZbzZ5NYfgv9i2kh5XpunHPOFC_izg8aMmU"

# simulator
# 8.1 (27)
#TOKEN="ekVGPfxsXcU:APA91bE4oeVWWf7-ozegUmc_o-J89-k1xcdx5A0Vtp14TqDGdRHzzWQ2SVapu_WAzB72cTM3lQlfMWZZ8c2uhNLnbGqVb_DsLuavUkRWRdQHYxcU9HaqQD84X-rgEswHYIap6XA8Ny1n"
# 8.0 (26)
#TOKEN="cDramMm8cPs:APA91bGfiGZhGs0S8rQr4K3YeKjJzzZcA0O8hynAKpvJwMHg-I5UsZzwgCKgsDK3X_gQpIY8RWZrmrMTfw2u9wc4egh3LqJwUNdLp-KNt1l0YQzd5SaLybd39LhAXYr8ZAQHcKyXnfwK"
# 7.1 (25)
TOKEN="f5g9UI3XCCY:APA91bGuCpUx4YIXzryCiiRapSJTZuADavSvy-D9-5MwVnjVbYhs211hNzxoMlDXnTr3AHkl1zPXj_2YNyHCWbXb1pSDJvkUP7dcQQJFPH047GtaP2aFr1065wRxE5RjaymCKYWJQPca"
# 6.0 (23)
#TOKEN="eU6pTo_4ycU:APA91bFb5Ch6niqslGukHC3mJTNfM3YRUHsF243HUGIZ5z9QotLfHkVLyAbY-KsfpXpFWNy64ZgsF56CtY-mg4wCZiO0sC8HEQniVB-DEuvXx8sMEUI4zDgmcR1Zg62RR96HwH4cjuQr"
# 5.1 (22)
#TOKEN="eR51rEBoBe8:APA91bH_DfMEHO2VN65Nz8GoSF45FJbAoDIr2AidmCKempF_iGrjqbSVsZLFAUsnpxsZ6y0mD7zcVHs8a7aisTcnvWJfF8w1sNwM-IrrZpsavSuk-Dgi3zdMwV5P8j7UR7Dpaz5PptDD4IxbmIoGpPmh4kfcEij7ng"

# 1+3t
#TOKEN="eDiAE4HoaVc:APA91bHplQTlwHEVVx_UBgF6283YBbeU6XIw9YGM_QfqRZjECja0QXkDvQCDzPYc3mLtzsFBH2rvIYhljRQbeNA9x1mRUbNvYvmLP9dqyffJOHdJRThqQAIm3M_2APAoaWj9og-TZWV0"


# optional fields: large_icon, color, sound, wake_screen


curl -X POST -H "Authorization: key=${KEY}" -H "Content-Type: application/json" -d '{
  "to": '\"${TOKEN}\"',
  "priority": "high",
  "data": {
    "custom_notification": {
        "title": "Some task title",
        "body": "Small description of task",
        "icon": "ic_notif",
        "large_icon": "ic_launcher",
        "OFF_sound": "default",
        "OFF_color":"#00ACD4",
        "priority": "high",
        "show_in_foreground": true,
        "wake_screen": true,
        "click_action": "goodday.action.OPEN_TASK",
        "goodday_action": "open_task",
        "taskId": "NycQcH",
        "channel": "channel_1"
    }
  }
}' "https://fcm.googleapis.com/fcm/send"



