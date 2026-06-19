// 進捗％の計算ロジック
//
// データ構造の鉄則:
//   scenarios は配列。各シナリオは categories 配列を持ち、
//   各カテゴリは tasks 配列を持つ（シナリオ→カテゴリ→タスクの3段の入れ子）。

// タスク配列から「全タスク数」と「完了数」を集計する
function countTasks(tasks = []) {
  const total = tasks.length
  const done = tasks.filter((task) => task.done).length
  return { total, done }
}

// 全タスク数と完了数から進捗％（0〜100の整数）を計算する
// 例: 10個中7個 → 70
export function calcPercent(total, done) {
  if (!total) return 0
  return Math.round((done / total) * 100)
}

// カテゴリ1つ分の進捗を計算する
// 戻り値: { total, done, percent }
export function categoryProgress(category) {
  const { total, done } = countTasks(category?.tasks)
  return { total, done, percent: calcPercent(total, done) }
}

// シナリオ全体（全カテゴリの全タスク）の進捗を計算する
// 戻り値: { total, done, percent }
export function scenarioProgress(scenario) {
  const categories = scenario?.categories ?? []
  const totals = categories.reduce(
    (acc, category) => {
      const { total, done } = countTasks(category?.tasks)
      acc.total += total
      acc.done += done
      return acc
    },
    { total: 0, done: 0 }
  )
  return { ...totals, percent: calcPercent(totals.total, totals.done) }
}
