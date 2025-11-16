import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
  },

  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  sheet: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
    maxHeight: "68%",
    overflow: "hidden",
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 14,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  headerUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },

  headerDateText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginBottom: 15,
  },

  scroll: {
    paddingBottom: 20,
  },

  commentRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },

  commentBody: {
    flex: 1,
  },

  commentUser: {
    fontWeight: "bold",
    color: "#111",
    marginBottom: 2,
  },

  commentText: {
    fontSize: 14,
    color: "#333",
  },

  description: {
    fontSize: 15,
    color: "#222",
  },

  inputContainer: {
    marginTop: 10,
  },

  input: {
    minHeight: 50,
    maxHeight: 140,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },

  errorText: {
    color: "#e74c3c",
    marginTop: 5,
    marginLeft: 4,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#7F8CFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
