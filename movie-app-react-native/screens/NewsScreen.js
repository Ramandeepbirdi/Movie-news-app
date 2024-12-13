import React, { useEffect, useState } from 'react'; 
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, SafeAreaView, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/loading'; // Import your Loading component
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { StatusBar } from 'expo-status-bar';

const ios = Platform.OS === 'ios';

const NewsScreen = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = async () => {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=f743aa0a8b144d7bbdec96ff31a0dff5`);
      const data = await response.json();
      setNewsData(data.articles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Article', { url: item.url })}>
      <View style={styles.newsItem}>
        <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
        <View style={styles.textContainer}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.newsDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header with Menu and Search */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={toggleMenu}>
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal with enhanced styling */}
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

      {/* Show Loading component while news data is being fetched */}
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          contentContainerStyle={styles.newsList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // Set background color to match the menu modal
  },
  header: {
    backgroundColor: '#444',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  newsList: {
    padding: 16,
  },
  newsItem: {
    backgroundColor: '#444', // Lighter gray for news items to make it stand out
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    padding: 12,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newsDescription: {
    color: '#d1d5db',
    fontSize: 14,
  },

  // Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darkened background
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    backgroundColor: '#444', // Slightly lighter gray for the buttons
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NewsScreen;
