import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './SplashScreen';

const RootLayout = () => {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const checkSplashSeen = async () => {
      const alreadySeen = await AsyncStorage.getItem('splash_seen');
      if (alreadySeen) {
        setShowSplash(false);
      } else {
        setShowSplash(true);
        await AsyncStorage.setItem('splash_seen', 'true');
      }
      setLoading(false);
    };

    checkSplashSeen();
  }, []);

  if (loading) return null;
  if (showSplash) return <SplashScreen />;
  return <Slot />;
};

export default RootLayout;
