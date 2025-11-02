import { theme } from "@/config/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onAdd: () => void;
};

export const AddTaskForm = ({ value, onChangeText, onAdd }: Props) => {
  return (
    <>
      <TextInput
        style={styles.newTaskInput}
        placeholder="Enter task description..."
        placeholderTextColor={theme.colors.inputTextSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onAdd}
      />
      <Pressable
        style={[
          styles.addTaskButton,
          !value.trim() && styles.addTaskButtonDisabled,
        ]}
        android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
        onPress={onAdd}
        disabled={!value.trim()}
      >
        <FontAwesome name="plus" size={20} style={styles.addTaskButtonIcon} />
        <Text style={styles.addTaskButtonText}>Add Task</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  newTaskInput: {
    fontSize: 16,
    color: theme.colors.inputText,
    backgroundColor: theme.colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  addTaskButton: {
    backgroundColor: theme.colors.text,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 0,
    gap: 8,
  },
  addTaskButtonDisabled: {
    backgroundColor: theme.colors.primaryDisabled,
    opacity: 0.5,
    borderColor: theme.colors.textSecondary,
  },
  addTaskButtonIcon: {
    color: theme.colors.text,
  },
  addTaskButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
