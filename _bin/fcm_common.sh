#!/bin/bash

KEY="AAAAiRiij2o:APA91bHxLzVRax0ynGzGlPV0RIW_R4Qfy8xtJiUi1q-2XAo4X_txYZL6BdaKxjBga7MJ1ejwignPFTwgewh_efJO9dH5T3fH0TTy1FcuKNZbzZ5NYfgv9i2kh5XpunHPOFC_izg8aMmU"

# android simulator
#TOKEN="coCva0IpwlU:APA91bGwwPFlmrEiIXB_MicH90HxSjqAO-DVtaivtcQm-MdFIgkmOdV8KPO-VabgPFbnghYju6Z_4nl9QbwnYgdQNDwAG7VvKhHrxgvWzoZ_d2pm0zSM2Fd2l-e-qWt_S32e93V8-1Lc"

# android simulator 6
#TOKEN="fFete326dKs:APA91bELWZhXZq7PKDykHEfxwtm4rox46WC2ndckjf3pNj9gAv4i6CNHb9BcZQTyfTvcI9S-Ti8kNq-NQj_wZAArsDN5Qvdkxbg_CP56VnWKnrr9JmILD7L3FjqTzoiJZfGV1vDZtc3U"

# android simulator 7
TOKEN="f5g9UI3XCCY:APA91bGuCpUx4YIXzryCiiRapSJTZuADavSvy-D9-5MwVnjVbYhs211hNzxoMlDXnTr3AHkl1zPXj_2YNyHCWbXb1pSDJvkUP7dcQQJFPH047GtaP2aFr1065wRxE5RjaymCKYWJQPca"

# android 1+3t
#TOKEN="eDiAE4HoaVc:APA91bHplQTlwHEVVx_UBgF6283YBbeU6XIw9YGM_QfqRZjECja0QXkDvQCDzPYc3mLtzsFBH2rvIYhljRQbeNA9x1mRUbNvYvmLP9dqyffJOHdJRThqQAIm3M_2APAoaWj9og-TZWV0"

#ios i4n5s
#TOKEN="fN4JS8a1LiE:APA91bFCWZr_vvDejrZEUQUt-Nw9oLpykLMjFobpNNLisTOiUzxeIvsEuTEVUeoopmOVbHWOD0uA_lKbVqq1RXtH_kGsFig5j_rlGeynAAR5M6K1D-B1iqHaiflVxszOBt_WgYqW7Naa"


curl -X POST -H "Authorization: key=${KEY}" -H "Content-Type: application/json" -d '{
  "to": '\"${TOKEN}\"',


  "content_available": true,
  "notification": {
    "title": "Some task title",
    "body": "Small description of task",
  },


  "priority": "high",
  "data": {
    "custom_notification": {
        "title": "Some task title",
        "body": "Small description of task",
        "icon": "ic_notif",
        "large_icon": "ic_launcher",
        "priority": "high",
        "show_in_foreground": true,
        "wake_screen": true,
        "click_action": "goodday.action.OPEN_TASK",
        "goodday_action": "open_task",
        "taskId": "NycQcH",
        "channel": "channel_1"
    },

    "goodday_action": "open_task",
    "taskId": "NycQcH"
  }
}' "https://fcm.googleapis.com/fcm/send"



