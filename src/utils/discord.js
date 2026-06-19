// Discord Webhook への投稿処理
//
// ⚠️ Webhook URL はコードに直書きしない。環境変数（VITE_DISCORD_WEBHOOK_URL）で管理する。
//    ローカルは .env、Vercel はダッシュボードの環境変数に設定する。

import { scenarioProgress, categoryProgress } from './progress.js'

// 環境変数から Webhook URL を取得する
export function getWebhookUrl() {
  return import.meta.env.VITE_DISCORD_WEBHOOK_URL || ''
}

// 進捗％から簡易の進捗バー（テキスト）を作る。Discordのメッセージ内で見せるため。
function textBar(percent, size = 20) {
  const filled = Math.round((percent / 100) * size)
  return '█'.repeat(filled) + '░'.repeat(size - filled)
}

// シナリオから、公開ビュー相当の Discord 投稿用テキスト（content）を組み立てる
export function buildShareContent(scenario) {
  if (!scenario) return ''

  const overview = scenario.overview ?? {}
  const { percent, done, total } = scenarioProgress(scenario)

  const lines = []
  lines.push(`**🎲 ${scenario.name || '（無題のシナリオ）'}**`)
  lines.push('')

  const overviewRows = [
    ['システム', overview.system],
    ['傾向', overview.tendency],
    ['人数', overview.players],
    ['プレイ時間', overview.playtime],
    ['推奨技能', overview.skills],
  ].filter(([, value]) => value)

  for (const [label, value] of overviewRows) {
    lines.push(`> **${label}**: ${value}`)
  }
  if (overviewRows.length) lines.push('')

  lines.push(`**準備進捗: ${percent}%**（${done}/${total}）`)
  lines.push('```')
  lines.push(`${textBar(percent)} ${percent}%`)
  lines.push('```')

  // カテゴリ別の内訳も添える
  for (const category of scenario.categories ?? []) {
    const cat = categoryProgress(category)
    lines.push(`・${category.name}: ${cat.percent}%（${cat.done}/${cat.total}）`)
  }

  return lines.join('\n')
}

// シナリオを Discord チャンネルに投稿する
// 成功時は { ok: true }、失敗時は { ok: false, error } を返す
export async function postScenarioToDiscord(scenario, webhookUrl = getWebhookUrl()) {
  if (!webhookUrl) {
    return {
      ok: false,
      error:
        'Webhook URL が設定されていません。.env に VITE_DISCORD_WEBHOOK_URL を設定してください。',
    }
  }

  const content = buildShareContent(scenario)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (!res.ok) {
      return { ok: false, error: `Discord への投稿に失敗しました（HTTP ${res.status}）` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: `通信エラー: ${err.message}` }
  }
}
