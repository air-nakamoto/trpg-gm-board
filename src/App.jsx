// アプリ本体
//
// データ構造の鉄則:
//   scenarios は配列です。各シナリオは categories 配列を持ち、
//   各カテゴリは tasks 配列を持つ（シナリオ→カテゴリ→タスクの3段の入れ子）。
//   グローバル状態は scenarios のみ。すべて useState で管理する。

import { useEffect, useState } from 'react'
import ScenarioView from './components/ScenarioView.jsx'
import PublicPreview from './components/PublicPreview.jsx'

// 新しい空のシナリオを1つ作る（id はタイムスタンプで一意化）
function createScenario() {
  return {
    id: Date.now(),
    name: '',
    overview: {
      system: '',
      tendency: '',
      players: '',
      playtime: '',
      skills: '',
    },
    categories: [],
  }
}

export default function App() {
  // Phase 1: シナリオは1つだが、データ構造の鉄則どおり「配列」で管理する
  const [scenarios, setScenarios] = useState(() => [createScenario()])
  const [activeIndex] = useState(0)
  const [tab, setTab] = useState('manage') // 'manage' | 'public'

  const scenario = scenarios[activeIndex]

  // 動作確認用: scenarios の中身を console で確認できるようにする（README の完了確認項目）
  useEffect(() => {
    console.log('scenarios:', scenarios)
  }, [scenarios])

  // activeIndex のシナリオだけを差し替える共通ヘルパ
  const updateScenario = (updater) => {
    setScenarios((prev) =>
      prev.map((s, i) => (i === activeIndex ? updater(s) : s))
    )
  }

  const handleChangeName = (name) => {
    updateScenario((s) => ({ ...s, name }))
  }

  const handleChangeOverview = (key, value) => {
    updateScenario((s) => ({
      ...s,
      overview: { ...s.overview, [key]: value },
    }))
  }

  const handleAddCategory = (name) => {
    updateScenario((s) => ({
      ...s,
      categories: [...s.categories, { name, tasks: [] }],
    }))
  }

  const handleAddTask = (categoryIndex, title) => {
    updateScenario((s) => ({
      ...s,
      categories: s.categories.map((category, i) => {
        if (i !== categoryIndex) return category
        const nextId =
          category.tasks.reduce((max, t) => Math.max(max, t.id ?? 0), 0) + 1
        return {
          ...category,
          tasks: [...category.tasks, { id: nextId, title, done: false }],
        }
      }),
    }))
  }

  const handleToggleTask = (categoryIndex, taskIndex) => {
    updateScenario((s) => ({
      ...s,
      categories: s.categories.map((category, i) => {
        if (i !== categoryIndex) return category
        return {
          ...category,
          tasks: category.tasks.map((task, j) =>
            j === taskIndex ? { ...task, done: !task.done } : task
          ),
        }
      }),
    }))
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>🎲 TRPG GM準備ボード</h1>
        <nav className="tabs">
          <button
            className={tab === 'manage' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
            onClick={() => setTab('manage')}
          >
            管理ビュー
          </button>
          <button
            className={tab === 'public' ? 'tabs__btn tabs__btn--active' : 'tabs__btn'}
            onClick={() => setTab('public')}
          >
            公開ビュー
          </button>
        </nav>
      </header>

      <main className="app__main">
        {tab === 'manage' ? (
          <ScenarioView
            scenario={scenario}
            onChangeName={handleChangeName}
            onChangeOverview={handleChangeOverview}
            onAddCategory={handleAddCategory}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
          />
        ) : (
          <PublicPreview scenario={scenario} />
        )}
      </main>
    </div>
  )
}
