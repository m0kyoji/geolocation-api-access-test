import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '位置情報トラッカー',
  description: 'バックグラウンドで位置情報を追跡するアプリ',
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body>{children}</body>
      </html>
  )
}