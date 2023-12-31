import Leads from '@/components/Leads';
import Footer from './Footer';
import Navbar from './Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';

// meta data api
export const metadata = {
  title: 'Coventen',
  description: 'We believe in best manufacturing practices will bring out best products',
}


// getting nav services
const navServices = async () => {

  const res = fetch('https://coventenapp.el.r.appspot.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query Categories($where: CategoryWhere) {
        categories(where: $where) {
          id
          name
          hasService {
            id
            title
            slug
          }
        }
      }`,
      variables: {
        "where": {
          "type": "SERVICE"
        }
      }
    })
  })
  const { data } = await res.then(res => res.json())
  return data?.categories
}


// getting nav services
const navSolution = async () => {

  const res = fetch('https://coventenapp.el.r.appspot.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query SolutionPages {
        solutionPages {
                id
                title
                hasSubsolution {
                  id
                  title
                  slug
                }
              }
            }`,
      next: { revalidate: 36 }
    })
  })
  const { data } = await res.then(res => res.json())
  return data?.solutionPages
}
// getting nav Industries
const navIndustries = async () => {

  const res = fetch('https://coventenapp.el.r.appspot.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query IndustryPages {
        industryPages {
          id
          title
        }
      }`,
    })
  })
  const { data } = await res.then(res => res.json())
  return data?.industryPages
}


// getting nav Industries
const navFeatures = async () => {

  const res = fetch('https://coventenapp.el.r.appspot.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query FeaturesPages($where: FeaturesPageWhere) {
        featuresPages(where: $where) {
          title
          id
          description
        }
      }`,
      next: { revalidate: 36 }
    })
  })
  const { data } = await res.then(res => res.json())
  return data?.featuresPages
}










// component

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const servicesPromise = navServices()
  const industriesPromise = navIndustries()
  const solutionPromise = navSolution()
  const featuresPromise = navFeatures()

  const [services, industries, solutions, features] = await Promise.all([servicesPromise, industriesPromise, solutionPromise, featuresPromise])




  // render

  return (
    <html lang="en">

      <body >

        <main className='bg-white text-gray-800 dark:bg-darkBg dark:text-white'>
          <Navbar services={services} industries={industries} solutions={solutions} features={features} />
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
