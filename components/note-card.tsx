import { theme } from "@/config/theme";
import { formatDistanceToNow } from "date-fns";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  note: Note;
};

const NoteCard = ({ note }: Props) => {
  const taskCount = note.taskList?.length || 0;
  const completedCount =
    note.taskList?.filter((task) => task.completed).length || 0;

  return (
    <View style={styles.noteCard}>
      <Text style={styles.noteTitle}>{note.title || "Untitled Note"}</Text>
      {taskCount > 0 && (
        <Text style={styles.noteContent}>
          {completedCount} of {taskCount} tasks completed
        </Text>
      )}
      <Text style={styles.noteUpdatedAt}>
        Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noteCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "rgb(28 37 45)",
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  noteCreatedAt: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  noteUpdatedAt: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default NoteCard;
