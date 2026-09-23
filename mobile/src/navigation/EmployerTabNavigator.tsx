import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../store/authSlice';

import EmployerDashboardScreen from '../screens/EmployerDashboardScreen';
import EmployerJobsScreen from '../screens/EmployerJobsScreen';
import EmployerApplicationsScreen from '../screens/EmployerApplicationsScreen';
import EmployerCandidatesScreen from '../screens/EmployerCandidatesScreen';
import EmployerProfileScreen from '../screens/EmployerProfileScreen';
import EmployerBillingScreen from '../screens/EmployerBillingScreen';
import EmployerPlatformDataScreen from '../screens/EmployerPlatformDataScreen';

const Tab = createBottomTabNavigator();

export default function EmployerTabNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => dispatch(logout());

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#034b71',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#0f172a', fontWeight: 'bold' },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName = 'bar-chart';
          if (route.name === 'EmployerDash') iconName = 'bar-chart';
          else if (route.name === 'EmployerJobs') iconName = 'briefcase';
          else if (route.name === 'EmployerApps') iconName = 'document-text';
          else if (route.name === 'EmployerCandidates') iconName = 'people';
          else if (route.name === 'EmployerProfile') iconName = 'business';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="EmployerDash" 
        component={EmployerDashboardScreen} 
        options={{ headerShown: false, title: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="EmployerJobs" 
        component={EmployerJobsScreen} 
        options={{ title: 'Manage Jobs' }} 
      />
      <Tab.Screen 
        name="EmployerApps" 
        component={EmployerApplicationsScreen} 
        options={{ title: 'Applications' }} 
      />
      <Tab.Screen 
        name="EmployerCandidates" 
        component={EmployerCandidatesScreen} 
        options={{ title: 'Candidates' }} 
      />
      <Tab.Screen 
        name="EmployerProfile" 
        component={EmployerProfileScreen} 
        options={{ title: 'Company' }} 
      />
      <Tab.Screen 
        name="EmployerBilling" 
        component={EmployerBillingScreen} 
        options={({ navigation }) => ({
          title: 'Billing & Plans',
          tabBarItemStyle: { display: 'none' },
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EmployerDash')}
              style={{ marginLeft: 16, padding: 4 }}
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
        })} 
      />
      <Tab.Screen 
        name="EmployerPlatformData" 
        component={EmployerPlatformDataScreen} 
        options={({ navigation }) => ({
          title: 'Platform Submissions',
          tabBarItemStyle: { display: 'none' },
          tabBarButton: () => null,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EmployerDash')}
              style={{ marginLeft: 16, padding: 4 }}
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
          ),
        })} 
      />
    </Tab.Navigator>
  );
}
