import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
  },
  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,            
  },
  avatar: { 
    width: 75, 
    height: 75,
    borderRadius: 64,
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 222, 226, 0.93)'
  },
  infoColumn: {
    flexShrink: 1 
  },
  name: { 
    fontSize: 24, 
    fontWeight: '700'
  },
  statsColumn: {
    marginTop: 10
  },
  statLine: {
    color: '#6b7280',
    marginTop: 8
  },
  statNumber: {
    fontWeight: '700',
    color: '#111827'
  },
  followButton: {
    paddingHorizontal: 20, 
    paddingVertical: 6, 
    borderRadius: 8, 
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  followPrimary: { 
    backgroundColor: "#1a57ff", 
    borderColor: "#1a57ff" 
  },
  followOutline: { 
    backgroundColor: "#fff", 
    borderColor: "#e5e7eb" 
  },
  followButtonText: {
    color: "#fff", 
    fontWeight: "500",
    fontSize: 13
  },
  followButtonTextOutline: { 
    color: "#111827" 
  },
  postTouchable: {
    width: "33.3333%", 
    aspectRatio: 0.6,
    borderWidth: 1.5, 
    borderColor: '#fff',
  },
  postImage: { 
    width: '100%',
    height: '100%'
  },
  noPosts: { 
    textAlign: "center", 
    color: "#888", 
    marginTop: 40 
  }
});