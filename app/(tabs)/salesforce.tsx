import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";

const SalesforceScreen = ({ navigation }: { navigation: any }) => {
  const reviews = [
    {
      id: "1",
      name: "James Landay",
      rating: 5,
      time: "5 days ago",
      comment: "There were some design issues but overall it was great",
      avatar: require("../../assets/images/james.jpg"),
    },
    {
      id: "2",
      name: "Eli Waldman",
      rating: 1,
      time: "2 weeks ago",
      comment: "BEST RESTROOM EVER, killed it!!!! ✓--.",
      avatar: require("../../assets/images/eli.jpg"),
    },
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <Text key={i} style={[styles.star, i < rating && styles.filledStar]}>
          ★
        </Text>
      ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.navigate("SanFrancisco")}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>

      {/* Restroom Info */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/images/toilet.png")}
            style={styles.toiletIcon}
          />
          <View style={styles.titleSection}>
            <Text style={styles.title}>Salesforce Floor 1</Text>
            <View style={styles.ratingRow}>
              {renderStars(4)} <Text style={styles.reviewCount}>83 reviews</Text>
            </View>
          </View>
          <View style={styles.icons}>
            <Text style={styles.icon}>🔖</Text>
            <Text style={styles.icon}>🔁</Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.detail}>0.4 Miles Away</Text>
        <Text style={styles.detail}>All Gender</Text>
        <Text style={styles.detail}>Wheelchair Accessible</Text>
        <Text style={styles.detail}>Public</Text>
      </View>

      {/* Reviews Section */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.reviewHeader}>Reviews</Text>}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.reviewContent}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{item.name}</Text>
                <Text style={styles.reviewTime}>{item.time}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.reviewText}>{item.comment}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={<Text style={styles.loadMore}>Load More...</Text>}
      />

      {/* Leave a Review Button */}
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => navigation.navigate("Review")}
      >
        <Text style={styles.reviewButtonText}>Leave a Review!</Text>
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
    </SafeAreaView>
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
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toiletIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icons: {
    flexDirection: "row",
  },
  icon: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    textAlign: "center",
  },
  reviewHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewCard: {
    flexDirection: "row",
    marginVertical: 10,
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewTime: {
    fontSize: 12,
    color: "gray",
  },
  star: {
    fontSize: 16,
    color: "lightgray", // Default color for stars
  },
  filledStar: {
    color: "#FFD700", // Yellow color for filled stars
  },
  reviewText: {
    fontSize: 14,
    color: "gray",
  },
  loadMore: {
    fontSize: 14,
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
  reviewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 60,
  },
  reviewButtonText: {
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
  activeIcon: {
    color: "#007AFF",
  },
});

export default SalesforceScreen;
