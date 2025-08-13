import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { apiService } from '../../lib/api';

const { width } = Dimensions.get('window');

export default function CreatePost() {
  const { user, isAuthenticated } = useAuth();
  const { sendLocalNotification } = useNotification();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert('Empty Post', 'Please add some content or an image to your post.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in to create a post.');
      return;
    }

    setLoading(true);
    try {
      let images = [];
      
      if (selectedImage) {
        // Upload image to backend first
        const uploadResponse = await apiService.uploadImage(selectedImage);
        if (uploadResponse.success) {
          images = [{ url: uploadResponse.imageUrl, publicId: uploadResponse.filename }];
        } else {
          throw new Error('Failed to upload image');
        }
      }

      const response = await apiService.createPost(content, images);
      
      if (response.success) {
        // Send success notification
        await sendLocalNotification({
          title: '🎉 Post Created!',
          body: 'Your post has been shared successfully!',
          data: { type: 'post_created' },
        });

        Alert.alert('Success', 'Your post has been shared!', [
          { text: 'OK', onPress: () => {
            setContent('');
            setSelectedImage(null);
            router.push('/dashboard');
          }}
        ]);
      } else {
        throw new Error(response.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Your Style</Text>
          <Text style={styles.headerSubtitle}>Inspire the fashion community</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.userAvatar}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </LinearGradient>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Fashion Lover'}</Text>
            <Text style={styles.userSubtext}>Posting to your feed</Text>
          </View>
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            placeholder="What's your latest fashion inspiration? Share your style tips, outfit ideas, or fashion thoughts..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </View>

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Media Options */}
        <View style={styles.mediaOptions}>
          <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.mediaButtonGradient}
            >
              <Ionicons name="image" size={24} color="#8B5CF6" />
              <Text style={styles.mediaButtonText}>Gallery</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.mediaButtonGradient}
            >
              <Ionicons name="camera" size={24} color="#8B5CF6" />
              <Text style={styles.mediaButtonText}>Camera</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaButton}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(168, 85, 247, 0.1)']}
              style={styles.mediaButtonGradient}
            >
              <MaterialIcons name="video-library" size={24} color="#8B5CF6" />
              <Text style={styles.mediaButtonText}>Video</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Hashtag Suggestions */}
        <View style={styles.hashtagSection}>
          <Text style={styles.hashtagTitle}>Popular Tags</Text>
          <View style={styles.hashtagContainer}>
            {['#OOTD', '#Fashion', '#Style', '#Trendy', '#Outfit', '#Dressify'].map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.hashtagButton}
                onPress={() => setContent(prev => prev + ` ${tag}`)}
              >
                <Text style={styles.hashtagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          style={[styles.postButton, loading && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#9CA3AF', '#9CA3AF'] : ['#8B5CF6', '#A855F7']}
            style={styles.postButtonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.postButtonText}>Share Post</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    minHeight: 120,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mediaButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  mediaButtonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  hashtagSection: {
    marginBottom: 24,
  },
  hashtagTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  postButton: {
    marginBottom: 20,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  postButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
