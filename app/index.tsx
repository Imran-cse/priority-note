import { theme } from "@/config/theme";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NoteCard from "@/components/note-card";
import { loadNotes } from "@/lib/storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";

type SortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "tasks-desc"
  | "tasks-asc";

const NoteList = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState<Note[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [showSortModal, setShowSortModal] = useState(false);

  const sortNotes = useCallback((notesToSort: Note[], option: SortOption) => {
    const sorted = [...notesToSort];
    switch (option) {
      case "date-desc":
        return sorted.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
        );
      case "title-asc":
        return sorted.sort((a, b) =>
          (a.title || "Untitled").localeCompare(b.title || "Untitled")
        );
      case "title-desc":
        return sorted.sort((a, b) =>
          (b.title || "Untitled").localeCompare(a.title || "Untitled")
        );
      case "tasks-desc":
        return sorted.sort(
          (a, b) => (b.taskList?.length || 0) - (a.taskList?.length || 0)
        );
      case "tasks-asc":
        return sorted.sort(
          (a, b) => (a.taskList?.length || 0) - (b.taskList?.length || 0)
        );
      default:
        return sorted;
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    const loadedNotes = await loadNotes();
    const sortedNotes = sortNotes(loadedNotes, sortOption);
    setNotes(sortedNotes);
  }, [sortOption, sortNotes]);

  // Set header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={styles.headerSortButton}
          onPress={() => setShowSortModal(true)}
          android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
        >
          <FontAwesome
            name="sort"
            size={20}
            style={styles.headerSortButtonIcon}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  // Reload notes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "date-desc":
        return "Newest First";
      case "date-asc":
        return "Oldest First";
      case "title-asc":
        return "Title (A-Z)";
      case "title-desc":
        return "Title (Z-A)";
      case "tasks-desc":
        return "Most Tasks";
      case "tasks-asc":
        return "Least Tasks";
    }
  };

  return (
    <View style={styles.container}>
      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Sort By</Text>
            {(
              [
                "date-desc",
                "date-asc",
                "title-asc",
                "title-desc",
                "tasks-desc",
                "tasks-asc",
              ] as SortOption[]
            ).map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.sortOption,
                  sortOption === option && styles.sortOptionSelected,
                ]}
                onPress={() => handleSortChange(option)}
                android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === option && styles.sortOptionTextSelected,
                  ]}
                >
                  {getSortLabel(option)}
                </Text>
                {sortOption === option && (
                  <FontAwesome
                    name="check"
                    size={16}
                    style={styles.sortOptionCheck}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [pressed && styles.noteCardPressed]}
            android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
            onPress={() => router.push(`/note-add?id=${item.id}`)}
          >
            <NoteCard note={item} />
          </Pressable>
        )}
        contentContainerStyle={styles.noteList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create one
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.addNoteButton,
          pressed && styles.addNoteButtonPressed,
        ]}
        android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
        onPress={() => router.push("/note-add")}
      >
        <FontAwesome name="plus" size={24} style={styles.addNoteButtonIcon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSortButton: {
    marginRight: 16,
    padding: 8,
  },
  headerSortButtonIcon: {
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: theme.colors.background,
  },
  sortOptionText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  sortOptionTextSelected: {
    fontWeight: "600",
  },
  sortOptionCheck: {
    color: theme.colors.primary,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  noteList: {
    padding: 12,
    gap: 12,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  noteCardPressed: {
    opacity: 0.8,
  },
  addNoteButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addNoteButtonIcon: {
    color: theme.colors.text,
  },
  addNoteButtonPressed: {
    backgroundColor: "rgb(35 45 55)",
    opacity: 0.8,
  },
});
export default NoteList;
