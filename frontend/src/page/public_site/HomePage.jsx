import React from 'react'
import Navbar from '../../components/public-site-components/Navbar'
import HeroBanner from '../../components/public-site-components/HeroBanner'
import Servicebar from '../../components/public-site-components/Servicebar'
import ShopByCategory from '../../components/public-site-components/ShopByCategory'
import ProductTrending from './trendingProduct/ProductTrending'
import NewInProduct from './NewInProduct/NewInProduct'

const HomePage = () => {
  return (
    <div>
        <div>
            <HeroBanner />

            <Servicebar />

            <ShopByCategory />

            <ProductTrending />

            <NewInProduct />
        </div>
    </div>
  )
}

export default HomePage