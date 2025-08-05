import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  scrollable?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  children,
  scrollable = false
}) => {
  const Container = scrollable ? ScrollView : View;
  const containerStyle = scrollable ? styles.scrollPageContainer : styles.pageContainer;

  return (
    <Container style={scrollable ? styles.scrollContainer : undefined} 
             contentContainerStyle={scrollable ? containerStyle : undefined}>
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
    paddingBottom: 120, // Add space for fixed navigation buttons
    justifyContent: 'center',
    minHeight: 600,
  },
  scrollPageContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120, // Add space for fixed navigation buttons
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
