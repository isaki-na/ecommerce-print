import CardProduct from '@/Components/Cards/CardProduct'
import GridProduct from '@/Components/Grids/GridProduct'
import SectionList from '@/Components/Sections/SectionList'
import Layout from '@/Layouts/Layout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'
import CarouselProduct from '../Product/CarouselProduct'
import CarouselSection from '../Home/CarouselSection'
import BannerText from '@/Components/Carousel/BannerText'
import Breadcrumb from '@/Components/Breadcrumb'
import SectionTitle from '@/Components/Sections/SectionTitle'
import MetaTag from '@/Components/MetaTag'

function Category({ category, categories = [] }) { // Added categories prop
    // Flatten all products from all categories
    const allProducts = categories.flatMap(cat => cat.products || []);

    return (
        <Layout>
            <MetaTag metaTag={category.metaTag} />
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
                                {allProducts.map((product) => (
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
                    <Link className="btn btn-secondary" href={route('search', { 'categories[]': category.id })} > 
                        Ver más productos
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

export default Category