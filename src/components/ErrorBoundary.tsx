import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from './primitives/Text';
import { Button } from './primitives/Button';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[NearBites ErrorBoundary] Caught exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.mascotBadge}>
              <Text style={styles.mascotEmoji}>🦅</Text>
            </View>
            <Text variant="heading1" align="center" style={styles.title}>
              Oops! Our scout hit a bump.
            </Text>
            <Text variant="body" color="textMuted" align="center" style={styles.message}>
              Something unexpected happened while looking for food. Let's get you back on the map!
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.devErrorBox}>
                <Text variant="caption" color="warning">
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <Button
              label="Try Again"
              variant="primary"
              onPress={this.handleReset}
              style={styles.retryButton}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.space6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.space5,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  mascotEmoji: {
    fontSize: 40,
  },
  title: {
    marginBottom: spacing.space3,
    color: colors.text,
  },
  message: {
    marginBottom: spacing.space6,
    maxWidth: 320,
  },
  devErrorBox: {
    backgroundColor: colors.surface,
    padding: spacing.space3,
    borderRadius: 8,
    marginBottom: spacing.space5,
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  retryButton: {
    minWidth: 180,
  },
});
