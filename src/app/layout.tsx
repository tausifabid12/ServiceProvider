import Leads from '@/components/Leads';
import Footer from './Footer';
import Navbar from './Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'COVENTEN',
  description: 'We believe in best manufacturing practices will bring out best products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body >

        <main className='bg-white text-gray-800 dark:bg-darkBg dark:text-white'>
          <Navbar />
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
        />

      </body>
    </html>
  )
}
