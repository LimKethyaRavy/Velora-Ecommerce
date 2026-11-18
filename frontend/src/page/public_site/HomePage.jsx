import React from 'react'
import Navbar from '../../components/public-site-components/Navbar'
import HeroBanner from '../../components/public-site-components/HeroBanner'
import Servicebar from '../../components/public-site-components/Servicebar'
import ShopByCategory from '../../components/public-site-components/ShopByCategory'
import ProductTrending from '../../components/trendingProduct/ProductTrending'
import NewInProduct from '../../components/NewInProduct/NewInProduct'
import CollectionCard from '../../components/COLLECTION/CollectionCard'

const HomePage = () => {
  return (
    <div>
        <div>
            <HeroBanner />

            <Servicebar />

            <ShopByCategory />

            <ProductTrending />

            <NewInProduct />

            <CollectionCard />
        </div>
    </div>
  )
}

export default HomePage