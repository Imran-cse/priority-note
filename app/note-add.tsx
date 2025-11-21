import { TaskCard } from "@/components/task-card";
import { TaskSortModal } from "@/components/task-sort-modal";
import { theme } from "@/config/theme";
import { useDebounce } from "@/hooks/use-debounce";
import { loadNote, saveNote } from "@/lib/storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type TaskSortOption =
  | "priority-desc"
  | "priority-asc"
  | "date-desc"
  | "date-asc"
  | "completed";

export default function NoteAdd() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string }>();
  const noteIdRef = useRef<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [headerTitleValue, setHeaderTitleValue] = useState("");

  const [title, setTitle] = useState("");
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [taskSortOption, setTaskSortOption] =
    useState<TaskSortOption>("priority-desc");
  const [showTaskSortModal, setShowTaskSortModal] = useState(false);

  // Debounce title and tasks for auto-save
  const debouncedTitle = useDebounce(title, 500);
  const debouncedTasksList = useDebounce(JSON.stringify(tasksList), 500);

  // Set up editable header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Pressable
          onPress={() => {
            setIsEditingTitle(true);
            setHeaderTitleValue(title || "Untitled Note");
          }}
          style={styles.headerTitleContainer}
        >
          {isEditingTitle ? (
            <TextInput
              style={styles.headerTitleInput}
              value={headerTitleValue}
              onChangeText={setHeaderTitleValue}
              onBlur={() => {
                setTitle(headerTitleValue.trim() || "");
                setIsEditingTitle(false);
              }}
              onSubmitEditing={() => {
                setTitle(headerTitleValue.trim() || "");
                setIsEditingTitle(false);
              }}
              placeholder="Enter note title"
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {title || "Untitled Note"}
            </Text>
          )}
        </Pressable>
      ),
    });
  }, [navigation, title, isEditingTitle, headerTitleValue]);

  // Load existing note if editing
  useEffect(() => {
    const loadExistingNote = async () => {
      if (params.id) {
        const id = parseInt(params.id);
        noteIdRef.current = id;
        const note = await loadNote(id);
        if (note) {
          setTitle(note.title);
          setHeaderTitleValue(note.title);
          setTasksList(note.taskList || []);
        }
      }
    };
    loadExistingNote();
  }, [params.id]);

  // Auto-save when debounced values change
  useEffect(() => {
    const autoSave = async () => {
      try {
        const parsedTasksList = JSON.parse(debouncedTasksList) || [];
        // Only save if there's at least a title or tasks
        if (debouncedTitle.trim() || parsedTasksList.length > 0) {
          const now = new Date();
          const note: Note = {
            id: noteIdRef.current || Date.now(),
            title: debouncedTitle.trim(),
            content: "",
            taskList: parsedTasksList,
            createdAt: noteIdRef.current
              ? (await loadNote(noteIdRef.current!))?.createdAt || now
              : now,
            updatedAt: now,
          };

          await saveNote(note);
          if (!noteIdRef.current) {
            noteIdRef.current = note.id;
          }
        }
      } catch (error) {
        console.error("Error auto-saving note:", error);
      }
    };

    autoSave();
  }, [debouncedTitle, debouncedTasksList]);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      description: "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
      priority: "medium",
    };
    setTasksList([...tasksList, newTask]);
  };

  const updateTaskDescription = (taskId: number, description: string) => {
    setTasksList(
      tasksList.map((task) =>
        task.id === taskId
          ? { ...task, description, updatedAt: new Date() }
          : task
      )
    );
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasksList(
      tasksList.map((task) =>
        task.id === taskId
          ? {
            ...task,
            completed: !task.completed,
            status: !task.completed ? "completed" : "pending",
            updatedAt: new Date(),
          }
          : task
      )
    );
  };

  const updateTaskPriority = (taskId: number, priority: TaskPriority) => {
    setTasksList(
      tasksList.map((task) =>
        task.id === taskId ? { ...task, priority, updatedAt: new Date() } : task
      )
    );
  };

  const removeTask = (taskId: number) => {
    setTasksList(tasksList.filter((task) => task.id !== taskId));
  };

  const getPriorityValue = (priority: TaskPriority): number => {
    switch (priority) {
      case "high":
        return 4;
      case "medium":
        return 3;
      case "low":
        return 2;
      case "none":
        return 1;
      default:
        return 0;
    }
  };

  const sortTasks = (tasks: Task[], option: TaskSortOption): Task[] => {
    const sorted = [...tasks];
    switch (option) {
      case "priority-desc":
        return sorted.sort(
          (a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority)
        );
      case "priority-asc":
        return sorted.sort(
          (a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority)
        );
      case "date-desc":
        return sorted.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()
        );
      case "completed":
        return sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      default:
        return sorted;
    }
  };

  const sortedTasks = sortTasks(tasksList, taskSortOption);

  const handleTaskSortChange = (option: TaskSortOption) => {
    setTaskSortOption(option);
    setShowTaskSortModal(false);
  };

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <Text style={styles.label}>Tasks</Text>
            <Pressable
              style={styles.taskSortButton}
              onPress={() => setShowTaskSortModal(true)}
              android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
            >
              <FontAwesome
                name="sort"
                size={16}
                style={styles.taskSortButtonIcon}
              />
            </Pressable>
          </View>

          {/* Tasks List */}
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompletion}
              onPriorityChange={updateTaskPriority}
              onDescriptionChange={updateTaskDescription}
              onRemove={removeTask}
            />
          ))}

          {/* Add Task Button */}
          <Pressable
            style={styles.addTaskButton}
            android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
            onPress={addTask}
          >
            <FontAwesome
              name="plus"
              size={20}
              style={styles.addTaskButtonIcon}
            />
            <Text style={styles.addTaskButtonText}>Add Task</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Task Sort Modal */}
      <TaskSortModal
        visible={showTaskSortModal}
        onRequestClose={() => setShowTaskSortModal(false)}
        taskSortOption={taskSortOption}
        onTaskSortChange={handleTaskSortChange}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  headerTitleInput: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    backgroundColor: theme.colors.inputBackground,
    padding: 4,
    borderRadius: 4,
    minWidth: 150,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
  },
  tasksSection: {
    marginTop: 8,
  },
  tasksHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  taskSortButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  taskSortButtonIcon: {
    color: theme.colors.text,
  },
  addTaskButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
