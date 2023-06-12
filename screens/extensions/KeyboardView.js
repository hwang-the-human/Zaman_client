import React from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import {ScrollView} from 'react-native-gesture-handler';

export default function KeyboardView({children}) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + StatusBar.currentHeight}
      scrollEventThrottle={16}>
      <StatusBar animated={true} barStyle="dark-content" />
      <ScrollView keyboardShouldPersistTaps="always">
        {children}
        <View style={styles.keyboardView__space} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  keyboardView__space: {
    height: 30,
    width: '100%',
  },
});
