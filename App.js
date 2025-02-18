import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";

export default function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({
    username: "",
    displayName: "",
    bio: "This is your bio",
  });
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportPostId, setReportPostId] = useState(null);

  // Navigation
  const navigate = (page) => setCurrentPage(page);

  // Registration
  const handleRegister = (email, username, displayName, birthday, password, confirmPassword) => {
    if (!email || !username || !displayName || !birthday || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setUsers([...users, { email, username, displayName, birthday, password }]);
    navigate("login");
    Alert.alert("Success", "Registration successful. Please log in.");
  };

  // Login
  const handleLogin = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      Alert.alert("Error", "Invalid email or password.");
      return;
    }
    setCurrentUser(user);
    setProfile({
      username: user.username,
      displayName: user.displayName,
      bio: "This is your bio",
    });
    navigate("home");
  };

  // Posting
  const handlePost = (text) => {
    if (text) {
      const newPost = {
        id: Math.random().toString(),
        text,
        username: profile.username,
        displayName: profile.displayName,
        comments: [],
      };
      setPosts([newPost, ...posts]);
    }
  };

  // Reporting
  const openReportModal = (postId) => {
    setReportPostId(postId);
    setReportModalVisible(true);
  };

  const submitReport = () => {
    if (reportReason.trim()) {
      Alert.alert(
        "Report Submitted",
        `Post ID: ${reportPostId}\nReason: ${reportReason}\n\n(Reason sent to qscroll.nmr@gmail.com)`
      );
      setReportModalVisible(false);
      setReportReason("");
      setReportPostId(null);
    } else {
      Alert.alert("Error", "Please provide a reason for reporting.");
    }
  };

  // Commenting
  const handleComment = (postId, commentText) => {
    if (commentText.trim()) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  {
                    id: Math.random().toString(),
                    text: commentText,
                    username: profile.username,
                    displayName: profile.displayName,
                  },
                  ...post.comments,
                ],
              }
            : post
        )
      );
    }
  };

  // Updating Profile
  const updateProfile = (field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  // Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setProfile({
      username: "",
      displayName: "",
      bio: "This is your bio",
    });
    navigate("welcome");
    Alert.alert("Success", "You have logged out.");
  };

  // Pages
  const renderPage = () => {
    switch (currentPage) {
      case "welcome":
        return <Welcome navigate={navigate} />;
      case "register":
        return <Register navigate={navigate} onRegister={handleRegister} />;
      case "login":
        return <Login navigate={navigate} onLogin={handleLogin} />;
      case "home":
        return (
          <Home
            posts={posts}
            onPost={handlePost}
            onReport={openReportModal}
            onComment={handleComment}
            navigate={navigate}
          />
        );
      case "settings":
        return (
          <Settings
            navigate={navigate}
            profile={profile}
            updateProfile={updateProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return <Welcome navigate={navigate} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderPage()}
      <Modal
        transparent={true}
        visible={reportModalVisible}
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Report Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your report reason"
              value={reportReason}
              onChangeText={setReportReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={submitReport}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setReportModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Components

const Welcome = ({ navigate }) => (
  <View style={styles.centered}>
    <Text style={styles.title}>Welcome to QScroll!</Text>
    <CustomButton title="Login" onPress={() => navigate("login")} />
    <CustomButton title="Register" onPress={() => navigate("register")} />
  </View>
);

const Register = ({ navigate, onRegister }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} />
      <TextInput style={styles.input} placeholder="Birthday (YYYY-MM-DD)" value={birthday} onChangeText={setBirthday} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <CustomButton title="Register" onPress={() => onRegister(email, username, displayName, birthday, password, confirmPassword)} />
    </View>
  );
};

const Login = ({ navigate, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <CustomButton title="Login" onPress={() => onLogin(email, password)} />
    </View>
  );
};

const Home = ({ posts, onPost, onReport, onComment, navigate }) => {
  const [postText, setPostText] = useState("");
  const [commentText, setCommentText] = useState(""); 

  const handlePostSubmit = () => {
    if (postText.trim() !== "") {
      onPost(postText);
      setPostText(""); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TextInput style={styles.input} placeholder="Write a post" value={postText} onChangeText={setPostText} onSubmitEditing={handlePostSubmit} />
      <CustomButton title="Post" onPress={handlePostSubmit} />
      <CustomButton title="Settings" onPress={() => navigate("settings")} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postHeader}>{item.displayName} ({item.username})</Text>
            <Text>{item.text}</Text>
            <FlatList
              data={item.comments}
              keyExtractor={(comment) => comment.id}
              renderItem={({ item: comment }) => (
                <View style={styles.comment}>
                  <Text style={styles.postHeader}>{comment.displayName} ({comment.username})</Text>
                  <Text>{comment.text}</Text>
                </View>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="Write a comment"
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={() => onComment(item.id, commentText)}
            />
            <CustomButton title="Comment" onPress={() => onComment(item.id, commentText)} />
            <CustomButton title="Report" onPress={() => onReport(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const Settings = ({ profile, updateProfile, navigate, onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.input}
        value={profile.username}
        onChangeText={(value) => updateProfile("username", value)}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={profile.displayName}
        onChangeText={(value) => updateProfile("displayName", value)}
        placeholder="Display Name"
      />
      <TextInput
        style={styles.input}
        value={profile.bio}
        onChangeText={(value) => updateProfile("bio", value)}
        placeholder="Bio"
      />
      <CustomButton title="Save Changes" onPress={() => {}} />
      <CustomButton title="Logout" onPress={onLogout} />
    </View>
  );
};

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F0EB",
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CD9D80",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#CD9D80",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "100%",
  },
  button: {
    backgroundColor: "#CD9D80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  post: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  postHeader: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  comment: {
    backgroundColor: "#f1f1f1",
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
