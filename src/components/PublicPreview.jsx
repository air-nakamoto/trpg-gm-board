// 公開ビュー（Discord投稿内容のプレビュー）
//
// 概要＋全体進捗％を整えて表示し、「Discordに共有」ボタンで Webhook に投稿する。

import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import { scenarioProgress, categoryProgress } from '../utils/progress.js'
import { postScenarioToDiscord, getWebhookUrl } from '../utils/discord.js'

const OVERVIEW_FIELDS = [
  { key: 'system', label: 'システム' },
  { key: 'tendency', label: '傾向' },
  { key: 'players', label: '人数' },
  { key: 'playtime', label: 'プレイ時間' },
  { key: 'skills', label: '推奨技能' },
]

export default function PublicPreview({ scenario }) {
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', message }
  const [posting, setPosting] = useState(false)

  const progress = scenarioProgress(scenario)
  const overview = scenario.overview ?? {}
  const webhookConfigured = Boolean(getWebhookUrl())

  const handleShare = async () => {
    setPosting(true)
    setStatus(null)
    const result = await postScenarioToDiscord(scenario)
    setPosting(false)
    if (result.ok) {
      setStatus({ type: 'ok', message: 'Discord に投稿しました！' })
    } else {
      setStatus({ type: 'error', message: result.error })
    }
  }

  return (
    <div className="public-preview">
      <div className="public-card">
        <h2 className="public-card__title">🎲 {scenario.name || '（無題のシナリオ）'}</h2>

        <dl className="public-card__overview">
          {OVERVIEW_FIELDS.map((field) =>
            overview[field.key] ? (
              <div className="public-card__row" key={field.key}>
                <dt>{field.label}</dt>
                <dd>{overview[field.key]}</dd>
              </div>
            ) : null
          )}
        </dl>

        <div className="public-card__progress">
          <h3>準備進捗</h3>
          <ProgressBar percent={progress.percent} />
          <p className="public-card__count">
            {progress.done} / {progress.total} タスク完了
          </p>
        </div>

        <ul className="public-card__categories">
          {scenario.categories.map((category, index) => {
            const cat = categoryProgress(category)
            return (
              <li key={index}>
                {category.name}: <strong>{cat.percent}%</strong>（{cat.done}/{cat.total}）
              </li>
            )
          })}
        </ul>
      </div>

      <div className="share">
        <button
          type="button"
          className="share__button"
          onClick={handleShare}
          disabled={posting}
        >
          {posting ? '投稿中…' : 'Discordに共有'}
        </button>

        {!webhookConfigured && (
          <p className="share__hint">
            ※ Webhook URL が未設定です。.env に <code>VITE_DISCORD_WEBHOOK_URL</code> を設定してください。
          </p>
        )}

        {status && (
          <p className={status.type === 'ok' ? 'share__status share__status--ok' : 'share__status share__status--error'}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  )
}
