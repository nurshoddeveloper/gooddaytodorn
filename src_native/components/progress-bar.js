import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import theme from '../app-theme/variables/platform';


export default function ProgressBar(props) {

  const {
    width, height,
    borderWidth, borderColor, borderRadius, backgroundColor,
    fillColor, progress,
    style,
  } = props;

  let fillWidth = (width * progress / 100) - (borderWidth * 2);

  //console.log('width', width)
  //console.log('progress', progress)
  //console.log('fillWidth', fillWidth)

  let mainStyle = {
    width: width,
    height: height,
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: borderRadius,
    backgroundColor: backgroundColor,
  };

  if (style) mainStyle = {...mainStyle, ...style};

  return (
    <View style={mainStyle}
    >
      {fillWidth > 0 &&
      <View style={{
        height: height - (borderWidth * 2),
        width: fillWidth,
        backgroundColor: fillColor,
        borderRadius: borderRadius,
      }}
      />
      }
    </View>
  );
}


ProgressBar.propTypes = {
  width: PropTypes.number.isRequired,
  progress: PropTypes.number,
  height: PropTypes.number,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
};

ProgressBar.defaultProps = {
  height: 12,
  progress: 0,
  borderWidth: 1,
  borderColor: theme.listBorderColor,
  borderRadius: 6,
  backgroundColor: theme.cardDefaultBg,
  fillColor: theme.brandPrimary
};

