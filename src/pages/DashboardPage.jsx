import { useEffect, useMemo, useState } from "react";

import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from "../services/taskService";
import { validateTaskForm } from "../utils/validators";

const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  PENDING: "pending"
};

function DashboardPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [formError, setFormError] = useState("");
  const [apiError, setApiError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchTasks = async ({ showLoader = true } = {}) => {
    try {
      if (showLoader) {
        setIsLoadingTasks(true);
      }
      const response = await getTasks();
      setTasks(response.data || []);
      setApiError("");
    } catch (error) {
      setApiError(error.response?.data?.message || "Could not load tasks");
    } finally {
      if (showLoader) {
        setIsLoadingTasks(false);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === FILTERS.COMPLETED) return tasks.filter((task) => task.completed);
    if (filter === FILTERS.PENDING) return tasks.filter((task) => !task.completed);
    return tasks;
  }, [tasks, filter]);

  const handleTaskInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
    setApiError("");
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();

    const errors = validateTaskForm(formData);
    if (errors.title) {
      setFormError(errors.title);
      return;
    }

    try {
      setIsMutating(true);
      const response = await createTask(formData);
      const newTask = response.data;

      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
      } else {
        await fetchTasks({ showLoader: false });
      }

      setFormData({ title: "", description: "" });
      setNotice("Task added successfully");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to create task");
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      setIsMutating(true);
      const response = await updateTask(task._id, { completed: !task.completed });
      const updatedTask = response.data;

      if (updatedTask) {
        setTasks((prev) => prev.map((item) => (item._id === task._id ? updatedTask : item)));
      } else {
        await fetchTasks({ showLoader: false });
      }

      setNotice(task.completed ? "Task moved to pending" : "Task completed");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to update task");
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdateTask = async (taskId, payload) => {
    try {
      setIsMutating(true);
      const response = await updateTask(taskId, payload);
      const updatedTask = response.data;

      if (updatedTask) {
        setTasks((prev) => prev.map((item) => (item._id === taskId ? updatedTask : item)));
      } else {
        await fetchTasks({ showLoader: false });
      }

      setNotice("Task updated");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to save changes");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this task?");
    if (!shouldDelete) return;

    try {
      setIsMutating(true);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((item) => item._id !== taskId));
      setNotice("Task deleted");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to delete task");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <main className="dashboard-page">
      <Navbar userName={user?.name || "User"} onLogout={logout} />

      <section className="dashboard-content">
        <div className="top-grid">
          <article className="new-task-card">
            <h2>Add a new task</h2>
            <p>Keep your task list focused and actionable.</p>

            <Alert type="error" message={apiError} />
            <Alert type="success" message={notice} />

            <form onSubmit={handleCreateTask}>
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleTaskInputChange}
                placeholder="Example: Prepare interview notes"
                error={formError}
              />
              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleTaskInputChange}
                placeholder="Optional details"
              />
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Saving..." : "Add Task"}
              </Button>
            </form>
          </article>

          <article className="stats-card">
            <h2>Overview</h2>
            <p>Total: {tasks.length}</p>
            <p>Completed: {tasks.filter((task) => task.completed).length}</p>
            <p>Pending: {tasks.filter((task) => !task.completed).length}</p>
          </article>
        </div>

        <section className="filter-bar">
          <Button
            variant={filter === FILTERS.ALL ? "primary" : "ghost"}
            onClick={() => setFilter(FILTERS.ALL)}
          >
            All
          </Button>
          <Button
            variant={filter === FILTERS.COMPLETED ? "primary" : "ghost"}
            onClick={() => setFilter(FILTERS.COMPLETED)}
          >
            Completed
          </Button>
          <Button
            variant={filter === FILTERS.PENDING ? "primary" : "ghost"}
            onClick={() => setFilter(FILTERS.PENDING)}
          >
            Pending
          </Button>
        </section>

        {isLoadingTasks ? (
          <Loader text="Loading your tasks..." />
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks in this view</h3>
            <p>Add one above and keep the momentum going.</p>
          </div>
        ) : (
          <section className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
                busy={isMutating}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
