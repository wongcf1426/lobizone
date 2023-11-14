import { createNavigationContainerRef } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';

export const statusList = [{'key':1, 'status':'公開'},{'key':0, 'status':'隱藏'}]
export const chartPalette = ['#afe3cf', '#aed0e8', '#FAC898', '#EED2CC', '#aAa6c5', '#D7D6CF']

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const platformOS = Platform.OS;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const device = (windowWidth > 1024) ? 'laptop' :((windowWidth >= 768) ? 'tablet' : 'mobile');
//export const device = 'mobile';
//export const device = 'tablet';
