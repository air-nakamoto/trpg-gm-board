// 進捗バー表示
// percent（0〜100）を受け取り、バーと％を表示するだけのプレゼン用コンポーネント。

export default function ProgressBar({ percent = 0, label }) {
  const clamped = Math.max(0, Math.min(100, percent))

  return (
    <div className="progress">
      {label && <div className="progress__label">{label}</div>}
      <div className="progress__track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
      <div className="progress__percent">{clamped}%</div>
    </div>
  )
}
