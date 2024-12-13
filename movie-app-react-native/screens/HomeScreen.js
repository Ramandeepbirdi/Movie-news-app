import { View, Text, TouchableOpacity, ScrollView, Platform, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import TrendingMovies from '../components/trendingMovies';
import MovieList from '../components/movieList';
import { StatusBar } from 'expo-status-bar';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../api/moviedb';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading';

const ios = Platform.OS === 'ios';

export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log('got trending', data.results.length);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log('got upcoming', data.results.length);
    if (data && data.results) setUpcoming(data.results);
  };
  
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log('got top rated', data.results.length);
    if (data && data.results) setTopRated(data.results);
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <SafeAreaView style={ios ? { marginBottom: -2 } : { marginBottom: 3 }}>
        <StatusBar style="light" />
        <View style={styles.searchBarContainer}>
          {/* Hamburger menu */}
          <TouchableOpacity onPress={toggleMenu}>
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Menu Modal */}
      <Modal transparent={true} visible={menuVisible} animationType="fade" onRequestClose={toggleMenu}>
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={() => { navigation.navigate('Home'); toggleMenu(); }} style={styles.menuButton}>
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.navigate('News'); toggleMenu(); }} style={styles.menuButton}>
                <Text style={styles.menuText}>News</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
          {/* Trending Movies Carousel */}
          {trending.length > 0 && <TrendingMovies data={trending} />}

          {/* Upcoming movies row */}
          {upcoming.length > 0 && <MovieList title="Upcoming" data={upcoming} />}

          {/* Top rated movies row */}
          {topRated.length > 0 && <MovieList title="Top Rated" data={topRated} />}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // Background color for the main container
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    color: '#FF6347', // Highlight color for M
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay background
    justifyContent: 'center',
    alignItems: 'flex-end', // Aligns menu to the right
  },
  menuContainer: {
    backgroundColor: '#333', // Dark background for menu
    width: 220,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    elevation: 5, // Adds shadow to the modal for better contrast
  },
  menuButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#444', // Slightly lighter gray for buttons
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
