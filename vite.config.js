import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages プロジェクトサイト用。https://<user>.github.io/trpg-gm-board/ で配信されるため、
  // アセットの参照パスをリポジトリ名配下に合わせる。
  base: '/trpg-gm-board/',
})
