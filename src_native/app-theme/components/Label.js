import variable from "./../variables/platform";

export default (variables = variable) => {
  const labelTheme = {
    ".focused": {
      width: 0
    },
    '.estimate-label': {
      width: 80,
    },
    fontSize: 17
  };

  return labelTheme;
};
