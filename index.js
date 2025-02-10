// src/screens/HomeScreen/index.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  I18nManager,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import Carousel from 'react-native-snap-carousel-v4';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Force RTL for Hebrew
I18nManager.forceRTL(true);

const screenWidth = Dimensions.get('window').width;

// Define default images
const DEFAULT_FEATURED_IMAGE = require('../../../assets/images/default-featured.png'); // Make sure this path is correct

// Define styles outside of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  featuredCard: {
    width: screenWidth - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuredImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  featuredContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  featuredSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

const FeaturedCard = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!item) return null;

  return (
    <TouchableOpacity style={styles.featuredCard} onPress={onPress}>
      <Image 
        source={imageError ? DEFAULT_FEATURED_IMAGE : item.image}
        style={styles.featuredImage}
        onError={() => setImageError(true)}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        defaultSource={DEFAULT_FEATURED_IMAGE}
      />
      {imageLoading && (
        <View style={styles.imageLoadingContainer}>
          <ActivityIndicator color="#007AFF" />
        </View>
      )}
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title || 'כותרת'}</Text>
        <Text style={styles.featuredSubtitle}>{item.subtitle || 'תיאור'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredWalkers, setFeaturedWalkers] = useState([]);
  const [userLocation, setUserLocation] = useState('תל אביב');
  const [refreshing, setRefreshing] = useState(false);

  const carouselItems = [
    {
      id: '1',
      type: 'walker',
      title: 'מטפל החודש',
      subtitle: 'דירוג: ⭐️ 4.9',
      image: require('../../../assets/images/featured-walker.jpg')
    },
  ].map(item => ({
    ...item,
    image: item.image || DEFAULT_FEATURED_IMAGE
  }));

  const loadFeaturedWalkers = useCallback(async () => {
    try {
      setError(null);
      // Your API call here
      const mockWalkers = [
        {
          id: '1',
          name: 'דני כהן',
          rating: 4.9,
          price: 50,
          image: 'https://example.com/walker1.jpg',
          reviews: 128,
        },
      ];
      setFeaturedWalkers(mockWalkers);
    } catch (err) {
      setError('שגיאה בטעינת נתונים');
      console.error('Error loading walkers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedWalkers();
  }, [loadFeaturedWalkers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeaturedWalkers();
    setRefreshing(false);
  }, [loadFeaturedWalkers]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Carousel
          data={carouselItems}
          renderItem={({ item }) => (
            <FeaturedCard
              item={item}
              onPress={() => navigation.navigate('WalkerDetails', { id: item.id })}
            />
          )}
          sliderWidth={screenWidth}
          itemWidth={screenWidth - 40}
          loop={true}
          autoplay={true}
          autoplayInterval={5000}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;