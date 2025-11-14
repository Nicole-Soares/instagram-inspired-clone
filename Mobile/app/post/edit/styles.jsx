import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    previewBox: {
        width: "100%",
        height: 250,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
    },
    placeholder: {
        color: "#999",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "#c0392b",
        fontSize: 16,
        textAlign: "center",
        padding: 20,
    }
});