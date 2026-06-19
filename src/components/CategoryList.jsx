// カテゴリとタスクの一覧（管理ビューの中身）
//
// 操作はすべて親（App）から渡されたハンドラ経由で行う。
// scenarios は App の useState で一元管理する（ここではローカル状態を持たない）。

import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import { categoryProgress } from '../utils/progress.js'

export default function CategoryList({
  categories = [],
  onAddCategory,
  onAddTask,
  onToggleTask,
}) {
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleAddCategory = (e) => {
    e.preventDefault()
    const name = newCategoryName.trim()
    if (!name) return
    onAddCategory(name)
    setNewCategoryName('')
  }

  return (
    <div className="categories">
      <form className="add-form" onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="新しいカテゴリ名（例: 用意する物）"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit">＋ カテゴリ追加</button>
      </form>

      {categories.length === 0 && (
        <p className="empty">まだカテゴリがありません。上のフォームから追加してください。</p>
      )}

      {categories.map((category, categoryIndex) => (
        <Category
          key={categoryIndex}
          category={category}
          categoryIndex={categoryIndex}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
        />
      ))}
    </div>
  )
}

function Category({ category, categoryIndex, onAddTask, onToggleTask }) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const progress = categoryProgress(category)

  const handleAddTask = (e) => {
    e.preventDefault()
    const title = newTaskTitle.trim()
    if (!title) return
    onAddTask(categoryIndex, title)
    setNewTaskTitle('')
  }

  return (
    <section className="category">
      <header className="category__header">
        <h3>{category.name}</h3>
        <span className="category__count">
          {progress.done}/{progress.total}
        </span>
      </header>

      <ProgressBar percent={progress.percent} />

      <ul className="task-list">
        {category.tasks.map((task, taskIndex) => (
          <li key={task.id ?? taskIndex} className="task">
            <label className={task.done ? 'task__label task__label--done' : 'task__label'}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggleTask(categoryIndex, taskIndex)}
              />
              <span>{task.title}</span>
            </label>
          </li>
        ))}
      </ul>

      <form className="add-form add-form--task" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="新しいタスク（例: NPCアイコン）"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">＋ タスク追加</button>
      </form>
    </section>
  )
}
