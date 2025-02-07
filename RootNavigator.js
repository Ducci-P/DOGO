// src/navigation/RootNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// מסכי אימות
import AuthScreen from '../screens/AuthScreen';

// מסכים ראשיים
import HomeScreen from '../screens/HomeScreen';
import WalkerDetailsScreen from '../screens/WalkerDetailsScreen';
import BookWalkScreen from '../screens/BookWalkScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';

// מסכי צ'אט
import ChatListScreen from '../screens/ChatListScreen';
import ChatConversationScreen from '../screens/ChatConversationScreen';

// מסכי פרופיל
import ProfileScreen from '../screens/ProfileScreen';
import WalkHistoryScreen from '../screens/WalkHistoryScreen';
import WalkDetailsScreen from '../screens/WalkerDetailsScreen';

import PreferencesScreen from '../screens/PreferencesScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import AddReviewScreen from '../screens/AddReviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// סטאק ניווט למסך הבית
function HomeStack() {
 return (
   <Stack.Navigator
     screenOptions={{
       headerTitleAlign: 'center',
     }}
   >
     <Stack.Screen 
       name="HomeMain" 
       component={HomeScreen} 
       options={{ title: 'בית' }} 
     />
     <Stack.Screen 
       name="WalkerDetails" 
       component={WalkerDetailsScreen} 
       options={({ route }) => ({ title: route.params.walker.name })} 
     />
     <Stack.Screen 
       name="BookWalk" 
       component={BookWalkScreen} 
       options={{ title: 'הזמנת טיול' }} 
     />
     <Stack.Screen 
       name="BookingConfirmation" 
       component={BookingConfirmationScreen} 
       options={{ 
         title: 'אישור הזמנה',
         headerLeft: null,
         gestureEnabled: false 
       }} 
     />

      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen} 
        options={{ title: 'ביקורות' }} 
      />

   </Stack.Navigator>
 );
}

// סטאק ניווט לצ'אט
function ChatStack() {
 return (
   <Stack.Navigator
     screenOptions={{
       headerTitleAlign: 'center',
     }}
   >
     <Stack.Screen 
       name="ChatList" 
       component={ChatListScreen} 
       options={{ title: 'צ׳אטים' }} 
     />
     <Stack.Screen 
       name="ChatConversation" 
       component={ChatConversationScreen}
       options={({ route }) => ({ 
         title: route.params.walkerName,
         headerBackTitle: 'חזרה'
       })}
     />
   </Stack.Navigator>
 );
}

// src/navigation/RootNavigator.js
// נעדכן את ProfileStack
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'פרופיל' }} 
      />
      <Stack.Screen 
        name="WalkHistory" 
        component={WalkHistoryScreen} 
        options={{ title: 'היסטוריית טיולים' }} 
      />
      <Stack.Screen 
        name="Preferences" 
        component={PreferencesScreen} 
        options={{ title: 'העדפות' }} 
      />
      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen} 
        options={{ title: 'ביקורות' }} 
      />
      <Stack.Screen 
        name="AddReview" 
        component={AddReviewScreen} 
        options={{ title: 'כתיבת ביקורת' }} 
      />
      <Stack.Screen 
        name="NotificationSettings" 
        component={NotificationSettingsScreen} 
        options={{ title: 'הגדרות התראות' }} 
      />
    </Stack.Navigator>
  );
 }

// ניווט תחתון ראשי
function MainTabs() {
 return (
   <Tab.Navigator
     screenOptions={({ route }) => ({
       tabBarIcon: ({ focused, color, size }) => {
         let iconName;
         switch (route.name) {
           case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
           case 'Chat': iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; break;
           case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
           default: iconName = 'home-outline';
         }
         return <Ionicons name={iconName} size={size} color={color} />;
       },
       tabBarLabelPosition: 'below-icon',
       tabBarStyle: {
         paddingBottom: 5,
         height: 60,
       },
       headerShown: false
     })}
   >
     <Tab.Screen 
       name="Home" 
       component={HomeStack} 
       options={{ 
         title: 'בית',
         tabBarLabel: 'בית'
       }} 
     />
     <Tab.Screen 
       name="Chat" 
       component={ChatStack} 
       options={{ 
         title: 'צ׳אטים',
         tabBarLabel: 'צ׳אטים'
       }} 
     />
     <Tab.Screen 
       name="Profile" 
       component={ProfileStack} 
       options={{ 
         title: 'פרופיל',
         tabBarLabel: 'פרופיל'
       }} 
     />
   </Tab.Navigator>
 );
}

// ניווט ראשי של האפליקציה
export default function RootNavigator() {
 const { user, loading } = useAuth();

 if (loading) {
   return null;
 }

 return (
   <Stack.Navigator screenOptions={{ headerShown: false }}>
     {!user ? (
       <Stack.Screen name="Auth" component={AuthScreen} />
     ) : (
       <Stack.Screen name="Main" component={MainTabs} />
     )}
   </Stack.Navigator>
 );
}