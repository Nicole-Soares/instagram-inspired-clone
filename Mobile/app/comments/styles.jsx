import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  scroll: {
    padding: 16,
    flexGrow: 1,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "700",
    marginBottom: 2,
  },
  description: {
    fontSize: 15,
    color: "#222",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  containerInputButton: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    height: 90,
    backgroundColor: "#fafafa",
    fontSize: 14,
    textAlignVertical: "top",
    color: "#222",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: -4,
    marginBottom: 4,
  },
  button: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#7F8CFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eaeaea",
  },
  headerAvatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarInitial: {
    fontWeight: "700",
    color: "#555",
  },
  headerUserName: {
    fontWeight: "700",
    fontSize: 16,
  },
});