import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

interface ProfileItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
  isLast?: boolean;
}

function ProfileItem({ icon, title, subtitle, value, onPress, showArrow = true, color, isLast }: ProfileItemProps) {
  const iconColor = color || '#666';

  return (
    <TouchableOpacity 
      style={[styles.profileItem, isLast && styles.profileItemLast]} 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemLeft}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
        <View style={styles.profileItemText}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.profileItemRight}>
        {value && <Text style={styles.profileItemValue}>{value}</Text>}
        {showArrow && onPress && (
          <MaterialIcons 
            name="chevron-right" 
            size={20} 
            color="#999"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would be implemented here.');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings would be implemented here.');
  };

  const handlePaymentMethods = () => {
    Alert.alert('Payment Methods', 'Payment methods management would be implemented here.');
  };

  const handleAddresses = () => {
    Alert.alert('Addresses', 'Address management would be implemented here.');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Support center would be implemented here.');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy would be displayed here.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service would be displayed here.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout pressed') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <Image
            source="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            style={styles.profileImage}
            contentFit="cover"
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@email.com</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <ProfileSection title="Account">
          <ProfileItem
            icon="person"
            title="Personal Information"
            subtitle="Name, phone, email"
            onPress={handleEditProfile}
          />
          <ProfileItem
            icon="notifications"
            title="Notifications"
            subtitle="Push notifications, email alerts"
            onPress={handleNotifications}
          />
          <ProfileItem
            icon="payment"
            title="Payment Methods"
            subtitle="Cards, digital wallets"
            onPress={handlePaymentMethods}
          />
          <ProfileItem
            icon="location-on"
            title="Addresses"
            subtitle="Home, work, and other locations"
            onPress={handleAddresses}
            isLast={true}
          />
        </ProfileSection>

        {/* Preferences Section */}
        <ProfileSection title="Preferences">
          <ProfileItem
            icon="language"
            title="Language"
            value="English"
            onPress={() => Alert.alert('Language', 'Language selection would be implemented here.')}
          />
          <ProfileItem
            icon="dark-mode"
            title="Theme"
            value={colorScheme === 'dark' ? 'Dark' : 'Light'}
            onPress={() => Alert.alert('Theme', 'Theme selection would be implemented here.')}
          />
          <ProfileItem
            icon="location-city"
            title="Default Location"
            value="New York, NY"
            onPress={() => Alert.alert('Location', 'Default location setting would be implemented here.')}
            isLast={true}
          />
        </ProfileSection>

        {/* Support Section */}
        <ProfileSection title="Support">
          <ProfileItem
            icon="help"
            title="Help Center"
            subtitle="FAQs, guides, and tutorials"
            onPress={handleSupport}
          />
          <ProfileItem
            icon="chat"
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => Alert.alert('Contact Support', 'Support chat would be implemented here.')}
          />
          <ProfileItem
            icon="star"
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => Alert.alert('Rate App', 'App rating would be implemented here.')}
          />
          <ProfileItem
            icon="share"
            title="Refer Friends"
            subtitle="Invite friends and earn rewards"
            onPress={() => Alert.alert('Refer Friends', 'Referral system would be implemented here.')}
            isLast={true}
          />
        </ProfileSection>

        {/* Legal Section */}
        <ProfileSection title="Legal">
          <ProfileItem
            icon="privacy-tip"
            title="Privacy Policy"
            onPress={handlePrivacy}
          />
          <ProfileItem
            icon="description"
            title="Terms of Service"
            onPress={handleTerms}
          />
          <ProfileItem
            icon="info"
            title="App Version"
            value="1.0.0"
            showArrow={false}
            isLast={true}
          />
        </ProfileSection>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#ff4757" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#00D4AA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#00D4AA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileItemLast: {
    borderBottomWidth: 0,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemText: {
    marginLeft: 16,
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  logoutSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4757',
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 100,
  },
}); 