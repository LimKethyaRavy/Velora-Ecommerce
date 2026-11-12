import React from 'react'
import { Outlet } from 'react-router-dom'


import AccouncementBar from '../components/public-site-components/AccouncementBar.jsx'
import Navbar from '../components/public-site-components/Navbar'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col">


        <AccouncementBar />

        <Navbar />

      <main>

      <Outlet />

      </main>
      

    </div>
  )
}

export default PublicLayout
