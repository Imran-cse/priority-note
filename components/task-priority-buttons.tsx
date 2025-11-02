import { theme } from "@/config/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  currentPriority: TaskPriority;
  onPriorityChange: (priority: TaskPriority) => void;
};

export const TaskPriorityButtons = ({
  currentPriority,
  onPriorityChange,
}: Props) => {
  const priorities: { label: string; value: TaskPriority }[] = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <View style={styles.priorityContainer}>
      {priorities.map(({ label, value }) => {
        const isActive = currentPriority === value;
        return (
          <Pressable
            key={value}
            style={[
              styles.priorityButton,
              isActive && value === "high" && styles.priorityButtonHigh,
              isActive && value === "medium" && styles.priorityButtonMedium,
              isActive && value === "low" && styles.priorityButtonLow,
            ]}
            onPress={() => onPriorityChange(value)}
          >
            <Text
              style={[
                styles.priorityButtonText,
                isActive && styles.priorityButtonTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  priorityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  priorityButtonHigh: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  priorityButtonMedium: {
    backgroundColor: "#eab308",
    borderColor: "#eab308",
  },
  priorityButtonLow: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
  priorityButtonTextActive: {
    color: "#fff",
  },
});

