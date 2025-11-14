import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eaeaea",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontWeight: "700",
    color: "#555",
  },
  userName: {
    fontWeight: "700",
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#777",
  },
  imageWrap: {
    marginTop: 6,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});