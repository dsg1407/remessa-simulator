import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Poppins, Nunito } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: '400',
})
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Quanto custa? - Calculo Remessa Conforme',
  authors: [
    {
      name: 'Daniel Santos Gonçalves',
      url: 'https://www.linkedin.com/in/dsg1407/',
    },
  ],
  description:
    'Simulador de tributos de importação atualizado com a nova regra Remessa Conforme 2024. Calcule os valores a pagar final nas suas compras internacionais, impostos de importação e INSS de acordo com a nova regra.',

  keywords:
    'dsg1407, remessa conforme, simulador, calculo remessa conforme, valor, imposto, importação, dólares, compras, alíquota',
  robots: 'index,follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable}`}>
      <body className={poppins.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
