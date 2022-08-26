import { Dimensions, Platform } from 'react-native';

// original function from DrawerNavigator,js
export function drawerWidth() {
  const { height, width } = Dimensions.get('window');
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = Platform.OS === 'ios' ? (isLandscape ? 32 : 44) : 56;
  const maxWidth = isTablet ? 320 : 280;

  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
}