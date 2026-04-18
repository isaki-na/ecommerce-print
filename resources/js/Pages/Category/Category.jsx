import CardProduct from '@/Components/Cards/CardProduct'
import GridProduct from '@/Components/Grids/GridProduct'
import SectionList from '@/Components/Sections/SectionList'
import Layout from '@/Layouts/Layout'
import { Head, Link, usePage } from '@inertiajs/react' // Added usePage import
import React, { useState } from 'react'
import CarouselProduct from '../Product/CarouselProduct'
import CarouselSection from '../Home/CarouselSection'
import BannerText from '@/Components/Carousel/BannerText'
import Breadcrumb from '@/Components/Breadcrumb'
import SectionTitle from '@/Components/Sections/SectionTitle'
import MetaTag from '@/Components/MetaTag'
import { uniqueProductsByParent } from '@/Helpers/helpers'

function Category({ category: categoryProp, categories: categoriesProp = [] }) { // Renamed params to avoid conflict
    const { categories, products, category } = usePage().props
    
    const [visibleCount, setVisibleCount] = useState(12); // Show 12 initially
    
    const allProducts = uniqueProductsByParent(products.data || []); // Render one card per parent product
    const visibleProducts = allProducts.slice(0, visibleCount);
    const hasMore = visibleCount < allProducts.length;

    return (
        <Layout>
            <Breadcrumb hideMobile data={[
                {
                    title: category.name,
                }
            ]} />
            <div className="container">
                <div className='space-y-10'>
                    {/* Single section with all products */}
                    <div>                   
                        <div className="mt-6">
                            <GridProduct>
                                {visibleProducts.map((product) => (
                                    <CardProduct
                                        key={product.ref}
                                        product={product}
                                        productNew={true}
                                    />
                                ))}
                            </GridProduct>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    {hasMore && (
                            <div className="flex justify-center mt-8">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setVisibleCount(prev => prev + 12)}
                                >
                                    Cargar más productos
                                </button>
                            </div>
                        )}
                </div>
            </div>
        </Layout>
    )
}

export default Category