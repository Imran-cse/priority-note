import { theme } from "@/config/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
type TaskSortOption =
  | "priority-desc"
  | "priority-asc"
  | "date-desc"
  | "date-asc"
  | "completed";

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  taskSortOption: TaskSortOption;
  onTaskSortChange: (option: TaskSortOption) => void;
}

export const TaskSortModal = ({
  visible,
  onRequestClose,
  taskSortOption,
  onTaskSortChange,
}: Props) => {
  const getTaskSortLabel = (option: TaskSortOption) => {
    switch (option) {
      case "priority-desc":
        return "High Priority";
      case "priority-asc":
        return "Low Priority";
      case "date-desc":
        return "Newest";
      case "date-asc":
        return "Oldest";
      case "completed":
        return "Completed Last";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onRequestClose}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>Sort Tasks By</Text>
          {(
            [
              "priority-desc",
              "priority-asc",
              "date-desc",
              "date-asc",
              "completed",
            ] as TaskSortOption[]
          ).map((option) => (
            <Pressable
              key={option}
              style={[
                styles.sortOption,
                taskSortOption === option && styles.sortOptionSelected,
              ]}
              onPress={() => onTaskSortChange(option)}
              android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  taskSortOption === option && styles.sortOptionTextSelected,
                ]}
              >
                {getTaskSortLabel(option)}
              </Text>
              {taskSortOption === option && (
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
  );
};

const styles = StyleSheet.create({
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
});
