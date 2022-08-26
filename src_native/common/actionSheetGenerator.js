import { ActionSheet } from 'native-base'
export default function actionSheetGenerator(config, title) {
  if (typeof config !== 'object') return
  let cancelIndex, destructiveIndex
  const ACTIONS = []

  const OPTIONS = Object.keys(config).map((key, i) => {
    if (config[key].cancel) cancelIndex = i
    if (config[key].destructive) destructiveIndex = i
    ACTIONS.push(config[key].action)
    return config[key].label || key
  })
  const onSelect = index => {
    if (typeof ACTIONS[index] !== 'function') return
    ACTIONS[index]()
  }
  const show = () => {
    // this stupid workaround is needed for Android to show
    // one action after another
    // be damned Google for your Android!
    ActionSheet.hide()
    setTimeout(() => {
      ActionSheet.show(
        {
          options: OPTIONS,
          cancelButtonIndex: cancelIndex,
          destructiveButtonIndex: destructiveIndex,
          title
        },
        onSelect
      )
    }, 10)
  }
  return show
}
