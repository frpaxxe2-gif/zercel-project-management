import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../features/workspaceSlice";
import toast from "react-hot-toast";
import { Plus, GripVertical } from "lucide-react";
import { Bug, Zap, Square, GitCommit, MessageSquare } from "lucide-react";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-600 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-600 dark:text-green-400" },
  IMPROVEMENT: { icon: GitCommit, color: "text-purple-600 dark:text-purple-400" },
  OTHER: { icon: MessageSquare, color: "text-amber-600 dark:text-amber-400" },
};

const priorityColors = {
  LOW: { background: "bg-red-100 dark:bg-red-950", text: "text-red-600 dark:text-red-400" },
  MEDIUM: { background: "bg-blue-100 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" },
  HIGH: { background: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-600 dark:text-emerald-400" },
};

const statusConfig = {
  TODO: {
    label: "To Do",
    color: "bg-slate-50 dark:bg-slate-900/40",
    headerBg: "bg-slate-200 dark:bg-slate-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-50 dark:bg-blue-900/20",
    headerBg: "bg-blue-200 dark:bg-blue-700",
  },
  DONE: {
    label: "Done",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    headerBg: "bg-emerald-200 dark:bg-emerald-700",
  },
};

const KanbanBoard = ({ tasks, onAddTask }) => {
  const dispatch = useDispatch();
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  const handleDragStart = (e, task, status) => {
    setDraggedTask(task);
    setDragSource(status);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();

    if (!draggedTask || targetStatus === dragSource) {
      setDraggedTask(null);
      setDragSource(null);
      return;
    }

    try {
      toast.loading("Updating task...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTask = { ...draggedTask, status: targetStatus };
      dispatch(updateTask(updatedTask));

      toast.dismissAll();
      toast.success("Task moved successfully");
    } catch {
      toast.dismissAll();
      toast.error("Failed to update task");
    }

    setDraggedTask(null);
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragSource(null);
  };

  const TaskCard = ({ task }) => {
    const TypeIcon = typeIcons[task.type]?.icon || MessageSquare;
    const typeColor = typeIcons[task.type]?.color || "text-gray-600";
    const priorityConfig = priorityColors[task.priority] || priorityColors.MEDIUM;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task, dragSource)}
        onDragEnd={handleDragEnd}
        className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
              {task.title}
            </h4>
          </div>
          <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1 rounded ${typeColor}`}>
            <TypeIcon className="w-3 h-3" />
          </div>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${priorityConfig.background} ${priorityConfig.text}`}>
            {task.priority}
          </span>
        </div>

        {task.assignee && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-xs text-white font-semibold">
                {task.assignee.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {task.assignee.name}
            </span>
          </div>
        )}
      </div>
    );
  };

  const KanbanColumn = ({ status, config }) => {
    const columnTasks = tasksByStatus[status];

    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
        className={`flex flex-col rounded-lg overflow-hidden ${config.color} min-h-96 flex-1`}
      >
        {/* Column Header */}
        <div className={`${config.headerBg} px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {config.label}
            </h3>
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
              {columnTasks.length}
            </span>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {columnTasks.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-slate-400 dark:text-slate-500">
              <p className="text-sm">No tasks yet</p>
            </div>
          ) : (
            columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>

        {/* Add Task Button */}
        <div className="px-3 pb-3">
          <button
            onClick={() => onAddTask && onAddTask(status)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded border border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <KanbanColumn key={status} status={status} config={config} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
