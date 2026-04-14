import { useState } from "react";

import Button from "./Button";
import Input from "./Input";

function TaskCard({ task, onToggle, onDelete, onUpdate, busy }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const handleSave = async () => {
    if (!title.trim()) return;

    await onUpdate(task._id, {
      title: title.trim(),
      description: description.trim()
    });
    setIsEditing(false);
  };

  return (
    <article className={`task-card ${task.completed ? "completed" : "pending"}`}>
      <div className="task-header">
        <span className={`status-dot ${task.completed ? "status-done" : "status-pending"}`} />
        <span className="status-label">{task.completed ? "Completed" : "Pending"}</span>
      </div>

      {isEditing ? (
        <div className="edit-panel">
          <Input
            label="Task"
            name={`title-${task._id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            label="Description"
            name={`description-${task._id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="task-actions">
            <Button variant="secondary" onClick={handleSave} disabled={busy || !title.trim()}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p className="task-description">{task.description || "No description added"}</p>
          <div className="task-actions">
            <Button
              variant="secondary"
              onClick={() => onToggle(task)}
              disabled={busy}
            >
              {task.completed ? "Mark Pending" : "Mark Complete"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(true)} disabled={busy}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(task._id)}
              disabled={busy}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </article>
  );
}

export default TaskCard;
