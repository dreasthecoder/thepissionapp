import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

const ReviewScreen = ({ navigation }: { navigation: any }) => {
  const [rating, setRating] = useState(0);
  const stars = Array(5).fill(0);

  const handleRating = (index: number) => {
    setRating(index + 1); // Update rating based on star clicked
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>

      {/* Restroom Info */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>Salesforce Tower Floor 1</Text>
      </View>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        {stars.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleRating(index)}>
            <Text
              style={[
                styles.star,
                index < rating ? styles.filledStar : styles.emptyStar,
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comments Section */}
      <TextInput
        style={styles.commentsInput}
        placeholder="Comments"
        placeholderTextColor="gray"
        multiline={true}
      />

      {/* Picture Upload */}
      <TouchableOpacity style={styles.pictureUpload}>
        <Text style={styles.pictureText}>Picture</Text>
        <Image
          source={require("../../assets/images/upload-icon.png")} // Replace with your upload icon
          style={styles.uploadIcon}
        />
      </TouchableOpacity>

      {/* Add Review Button */}
      <TouchableOpacity style={styles.addReviewButton}>
        <Text style={styles.addReviewText}>Add Review</Text>
      </TouchableOpacity>

      {/* Bottom Tab */}
      <View style={styles.bottomTab}>
        <TouchableOpacity>
          <Text style={[styles.icon, styles.activeIcon]}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  backButton: {
    fontSize: 18,
    color: "#007AFF",
    marginVertical: 10,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ratingSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 5,
  },
  filledStar: {
    color: "#FFD700", // Gold color for filled stars
  },
  emptyStar: {
    color: "#E0E0E0", // Light gray for empty stars
  },
  commentsInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    height: 100,
    textAlignVertical: "top", // Align text to top in multiline input
  },
  pictureUpload: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  pictureText: {
    fontSize: 16,
    color: "gray",
    flex: 1,
  },
  uploadIcon: {
    width: 20,
    height: 20,
  },
  addReviewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 60,
  },
  addReviewText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  icon: {
    fontSize: 20,
    color: "gray",
  },
  activeIcon: {
    color: "#007AFF",
  },
});

export default ReviewScreen;

