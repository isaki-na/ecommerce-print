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

function Category({ category: categoryProp, categories: categoriesProp = [] }) { // Renamed params to avoid conflict
    const { categories, products, category } = usePage().props
    
    const [visibleCount, setVisibleCount] = useState(12); // Show 12 initially
    
    const allProducts = products.data || []; // Use the products for this category
    const visibleProducts = allProducts.slice(0, visibleCount);
    const hasMore = visibleCount < allProducts.length;

    return (
        <Layout>
            <Breadcrumb data={[
                {
                    title: category.name,
                }
            ]} />

            <BannerText title={category.name}
                entry={category.entry} />

            <div className="container">
                <div className='space-y-10'>
                    {/* Single section with all products */}
                    <div>
                        <SectionTitle title="Todos los Productos" />
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