// 管理ビュー（全カテゴリ・全タスク）
//
// シナリオの概要編集・カテゴリ／タスクの追加・チェックを行う画面。
// 状態は App から渡され、変更は各ハンドラ経由で App の scenarios に反映される。

import ProgressBar from './ProgressBar.jsx'
import CategoryList from './CategoryList.jsx'
import { scenarioProgress } from '../utils/progress.js'

const OVERVIEW_FIELDS = [
  { key: 'system', label: 'システム', placeholder: 'クトゥルフ神話TRPG 第6版' },
  { key: 'tendency', label: '傾向', placeholder: 'クローズド / シティ / 謎解き 等' },
  { key: 'players', label: '人数', placeholder: '3〜4人' },
  { key: 'playtime', label: 'プレイ時間', placeholder: '4時間前後' },
  { key: 'skills', label: '推奨技能', placeholder: '目星, 聞き耳' },
]

export default function ScenarioView({
  scenario,
  onChangeName,
  onChangeOverview,
  onAddCategory,
  onAddTask,
  onToggleTask,
}) {
  const progress = scenarioProgress(scenario)

  return (
    <div className="scenario-view">
      <div className="field">
        <label className="field__label" htmlFor="scenario-name">
          シナリオ名
        </label>
        <input
          id="scenario-name"
          className="field__input field__input--title"
          type="text"
          placeholder="例: 悪霊の家"
          value={scenario.name}
          onChange={(e) => onChangeName(e.target.value)}
        />
      </div>

      <fieldset className="overview">
        <legend>シナリオ概要</legend>
        <div className="overview__grid">
          {OVERVIEW_FIELDS.map((field) => (
            <div className="field" key={field.key}>
              <label className="field__label" htmlFor={`overview-${field.key}`}>
                {field.label}
              </label>
              <input
                id={`overview-${field.key}`}
                className="field__input"
                type="text"
                placeholder={field.placeholder}
                value={scenario.overview?.[field.key] ?? ''}
                onChange={(e) => onChangeOverview(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <section className="overall-progress">
        <h2>
          全体進捗 <span className="overall-progress__count">（{progress.done}/{progress.total}）</span>
        </h2>
        <ProgressBar percent={progress.percent} />
      </section>

      <CategoryList
        categories={scenario.categories}
        onAddCategory={onAddCategory}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
      />
    </div>
  )
}
