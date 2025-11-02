import { theme } from "@/config/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TaskPriorityButtons } from "./task-priority-buttons";

type Props = {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onPriorityChange: (taskId: number, priority: TaskPriority) => void;
  onDescriptionChange: (taskId: number, description: string) => void;
  onRemove: (taskId: number) => void;
};

export const TaskCard = ({
  task,
  onToggleComplete,
  onPriorityChange,
  onDescriptionChange,
  onRemove,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.description);
  const hasAutoOpenedRef = useRef(false);

  const handleDescriptionPress = () => {
    if (!task.completed) {
      setIsEditing(true);
      setEditText(task.description);
    }
  };

  const handleDescriptionBlur = () => {
    if (editText.trim()) {
      onDescriptionChange(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleDescriptionSubmit = () => {
    if (editText.trim()) {
      onDescriptionChange(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  // Auto-focus for new empty tasks
  useEffect(() => {
    if (task.description === "" && !hasAutoOpenedRef.current) {
      setIsEditing(true);
      setEditText("");
      hasAutoOpenedRef.current = true;
    }
  }, [task.description, task.id]);

  return (
    <View style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
      <TouchableWithoutFeedback
        onLongPress={() => {
          if (!isEditing) {
            onToggleComplete(task.id);
          }
        }}
        delayLongPress={500}
      >
        <View>
          <View style={styles.taskHeader}>
            {isEditing ? (
              <TextInput
                style={styles.taskDescriptionInput}
                value={editText}
                onChangeText={setEditText}
                onBlur={handleDescriptionBlur}
                onSubmitEditing={handleDescriptionSubmit}
                placeholder="Enter task description..."
                placeholderTextColor={theme.colors.inputTextSecondary}
                autoFocus
                multiline
              />
            ) : (
              <Pressable
                style={styles.taskDescriptionContainer}
                onPress={handleDescriptionPress}
              >
                <Text
                  style={[
                    styles.taskDescription,
                    task.completed && styles.taskDescriptionCompleted,
                  ]}
                >
                  {task.description || "Tap to add description"}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={styles.removeTaskButton}
              onPress={() => onRemove(task.id)}
            >
              <FontAwesome
                name="trash-o"
                size={16}
                style={styles.removeTaskButtonIcon}
              />
            </Pressable>
          </View>
          {!isEditing && (
            <View
              style={task.completed ? styles.priorityButtonsCompleted : null}
            >
              <TaskPriorityButtons
                currentPriority={task.priority}
                onPriorityChange={(priority) =>
                  onPriorityChange(task.id, priority)
                }
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: theme.colors.inputBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  priorityButtonsCompleted: {
    opacity: 0.5,
  },
  taskDescriptionContainer: {
    flex: 1,
    minHeight: 24,
  },
  taskDescription: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  taskDescriptionCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
  taskDescriptionInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.inputText,
    backgroundColor: theme.colors.background,
    padding: 8,
    borderRadius: 4,
    minHeight: 24,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  removeTaskButton: {
    padding: 4,
    marginTop: 2,
  },
  removeTaskButtonIcon: {
    color: theme.colors.textSecondary,
  },
});
