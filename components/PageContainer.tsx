import React, { ReactNode, RefObject } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scrollable?: boolean;
  scrollViewRef?: RefObject<ScrollView | null>;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  children,
  scrollable = false,
  scrollViewRef
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerStyle = scrollable ? styles.scrollPageContainer : styles.pageContainer;

  return (
    <Container 
      ref={scrollable ? scrollViewRef : undefined}
      style={scrollable ? styles.scrollContainer : undefined} 
      contentContainerStyle={scrollable ? containerStyle : undefined}
      showsVerticalScrollIndicator={scrollable}
      indicatorStyle={scrollable ? "white" : undefined}
    >
      <View style={!scrollable ? containerStyle : undefined}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 40, // Increased from 20 to ensure proper spacing
    justifyContent: 'center',
    minHeight: 600,
  },
  scrollPageContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120, // Increased from 40 to add more space at bottom for scrollable pages
    justifyContent: 'flex-start',
    minHeight: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
});
