import React, { ReactNode, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface KeyboardAwareLayoutRef {
  scrollToTop: (animated?: boolean) => void;
  getScrollView: () => any;
}

interface Props {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  resetScrollTrigger?: any;
}

const KeyboardAwareLayout = forwardRef<KeyboardAwareLayoutRef, Props>(({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  resetScrollTrigger,
}, ref) => {
  const scrollRef = useRef<any>(null);

  const scrollToTop = (animated = false) => {
    if (scrollRef.current) {
      if (typeof scrollRef.current.scrollToPosition === 'function') {
        scrollRef.current.scrollToPosition(0, 0, animated);
      } else if (typeof scrollRef.current.scrollTo === 'function') {
        scrollRef.current.scrollTo({ x: 0, y: 0, animated });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToTop,
    getScrollView: () => scrollRef.current,
  }));

  useEffect(() => {
    if (resetScrollTrigger !== undefined) {
      // Immediate scroll to top when step/trigger changes
      scrollToTop(false);
      // Small timeout to guarantee DOM/layout measurement reset
      const timer = setTimeout(() => {
        scrollToTop(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [resetScrollTrigger]);

  if (!scrollable) {
    return (
      <KeyboardAvoidingView
        style={[styles.flex, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={[styles.flex, style]}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === 'ios' ? 30 : 80}
        extraHeight={Platform.OS === 'ios' ? 30 : 80}
      >
        {children}
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
});

export default KeyboardAwareLayout;

const styles = StyleSheet.create({ flex: { flex: 1 } });
