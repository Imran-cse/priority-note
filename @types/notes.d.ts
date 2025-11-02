type TaskStatus = "pending" | "in_progress" | "completed";

type TaskPriority = "low" | "medium" | "high" | "critical" | "none";

type Task = {
  id: number;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: TaskStatus;
  priority: TaskPriority;
};

type Note = {
  id: number;
  title: string;
  content: string;
  taskList: Task[];
  createdAt: Date;
  updatedAt: Date;
};
