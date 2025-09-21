import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Upload, Calendar, FileText, Activity, Bell } from 'lucide-react-native';
import { useAuth } from '@/utils/auth/useAuth';

const { width, height } = Dimensions.get('window');

export default function CalcifyXMobile() {
  const insets = useSafeAreaInsets();
  const { signIn, isReady, auth } = useAuth();
  const [currentDemo, setCurrentDemo] = useState(0);

  const demoSteps = [
    { title: "Upload Scan", icon: Upload, color: "#14B8A6" },
    { title: "AI Analysis", icon: Brain, color: "#3B82F6" },
    { title: "Get Results", icon: FileText, color: "#8B5CF6" },
    { title: "Book Appointment", icon: Calendar, color: "#F59E0B" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0F2027']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading CalcifyX...</Text>
        </View>
      </View>
    );
  }

  if (auth) {
    // User is authenticated, show dashboard
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0F2027']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoInner} />
            </View>
            <Text style={styles.logoText}>CalcifyX</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back!</Text>
            <Text style={styles.welcomeSubtitle}>Track your kidney health journey</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#14B8A620' }]}>
                <FileText size={24} color="#14B8A6" />
              </View>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#3B82F620' }]}>
                <Calendar size={24} color="#3B82F6" />
              </View>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#10B98120' }]}>
                <Activity size={24} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#14B8A620' }]}>
              <Upload size={24} color="#14B8A6" />
              <Text style={styles.actionButtonText}>Upload New Scan</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3B82F620' }]}>
              <Calendar size={24} color="#3B82F6" />
              <Text style={styles.actionButtonText}>Book Appointment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8B5CF620' }]}>
              <FileText size={24} color="#8B5CF6" />
              <Text style={styles.actionButtonText}>View Reports</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>CT Scan Analysis Complete</Text>
                <Text style={styles.activityDate}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Appointment Scheduled</Text>
                <Text style={styles.activityDate}>1 day ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#14B8A6' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>MRI Scan Uploaded</Text>
                <Text style={styles.activityDate}>3 days ago</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // User is not authenticated, show landing page
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0F2027']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroLogo}>
            <View style={styles.heroLogoInner} />
          </View>
          <Text style={styles.heroTitle}>CalcifyX</Text>
          <Text style={styles.heroSubtitle}>Smarter Kidney Care with AI</Text>
          <Text style={styles.heroDescription}>
            Advanced AI-powered kidney stone detection and patient care assistant. 
            Upload scans, get instant analysis, and connect with specialists.
          </Text>
        </View>

        {/* Demo Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>How It Works</Text>
          <View style={styles.demoSteps}>
            {demoSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentDemo;
              
              return (
                <View key={index} style={styles.demoStep}>
                  <View style={[
                    styles.demoStepIcon,
                    { 
                      backgroundColor: isActive ? `${step.color}30` : '#374151',
                      borderColor: isActive ? step.color : '#6B7280'
                    }
                  ]}>
                    <IconComponent 
                      size={24} 
                      color={isActive ? step.color : '#9CA3AF'} 
                    />
                  </View>
                  <Text style={[
                    styles.demoStepText,
                    { color: isActive ? '#FFFFFF' : '#9CA3AF' }
                  ]}>
                    {step.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Advanced Features</Text>
          
          <View style={styles.featureCard}>
            <Brain size={32} color="#14B8A6" />
            <Text style={styles.featureTitle}>AI-Powered Analysis</Text>
            <Text style={styles.featureDescription}>
              Advanced machine learning algorithms detect kidney stones with high accuracy.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Upload size={32} color="#3B82F6" />
            <Text style={styles.featureTitle}>Secure Upload</Text>
            <Text style={styles.featureDescription}>
              Upload CT and MRI scans securely with end-to-end encryption.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Calendar size={32} color="#8B5CF6" />
            <Text style={styles.featureTitle}>Expert Network</Text>
            <Text style={styles.featureDescription}>
              Connect with qualified urologists and nephrologists for consultation.
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => signIn()}
          >
            <LinearGradient
              colors={['#14B8A6', '#0D9488']}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.ctaSubtext}>
            Join thousands of patients using CalcifyX for smarter healthcare decisions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#14B8A6',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#14B8A620',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#14B8A6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: '#14B8A6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 184, 166, 0.1)',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDate: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#14B8A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroLogoInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: '#14B8A6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    color: '#14B8A6',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  heroDescription: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  demoSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  demoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  demoSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoStep: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  demoStepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  demoStepText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    marginBottom: 16,
  },
  ctaButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});