import { createNavigationContainerRef } from '@react-navigation/native';
import { Platform, Dimensions } from 'react-native';
import * as React from 'react';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const platformOS = Platform.OS;
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
//export const device = (windowWidth > 1024) ? 'laptop' :((windowWidth > 768) ? 'tablet' : 'mobile');
export const device = 'tablet';