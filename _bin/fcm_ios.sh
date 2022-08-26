#!/bin/bash


KEY="AAAAiRiij2o:APA91bHxLzVRax0ynGzGlPV0RIW_R4Qfy8xtJiUi1q-2XAo4X_txYZL6BdaKxjBga7MJ1ejwignPFTwgewh_efJO9dH5T3fH0TTy1FcuKNZbzZ5NYfgv9i2kh5XpunHPOFC_izg8aMmU"

TOKEN="fN4JS8a1LiE:APA91bFCWZr_vvDejrZEUQUt-Nw9oLpykLMjFobpNNLisTOiUzxeIvsEuTEVUeoopmOVbHWOD0uA_lKbVqq1RXtH_kGsFig5j_rlGeynAAR5M6K1D-B1iqHaiflVxszOBt_WgYqW7Naa"

# optional fields: subtitle, click_action, sound




curl -X POST -H "Authorization: key=${KEY}" -H "Content-Type: application/json" -d '{
  "to": '\"${TOKEN}\"'
  "content_available": true,
  "notification": {
    "title": "Some task title",
    "subtitle": "Task subtitle",
    "body": "Small description of task"
  },
  "data": {
    "goodday_action": "open_task",
    "task_id": "NycQcH"
  }
}' "https://fcm.googleapis.com/fcm/send"



