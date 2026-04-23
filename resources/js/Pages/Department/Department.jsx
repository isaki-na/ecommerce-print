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
import MetaTag from '@/Components/MetaTag'
import { uniqueProductsByParent } from '@/Helpers/helpers'

function Department({ department, offertProducts, bestSellersProducts, categories }) {
    // console.log(offertProducts[0])
    return (
        <Layout>
            <MetaTag metaTag={department.metaTag} />
            <Breadcrumb data={[
                {
                    title: department.name,
                }
            ]} />

            <BannerText title={department.name}
                entry={department.entry} />

            <div className="container">
                <SectionList
                    title="Top Ofertas"
                    titleClassName="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900"
                >
                    <CarouselProduct products={offertProducts} />
                </SectionList>

                {/* {bestSellersProduct.length > 0 && (
                    <SectionList title="Los mas vendidos">
                        <CarouselProduct productVariants={bestSellersProduct} />
                    </SectionList>
                )} */}

                <div className='space-y-10'>
                    {categories.map((category) => (
                        <div className="">
                            <div>
                                <GridProduct>
                                    {uniqueProductsByParent(category.products).map((product) => (
                                        <CardProduct
                                            key={product.ref}
                                            product={product}
                                            productNew={true}
                                        />
                                    ))}
                                </GridProduct>
                            </div>
                        </div>

                    ))}
                </div>

                <div className="flex justify-center">
                    <Link className="btn btn-secondary" href={route('search', { 'departments[]': department.id })} > Ver mas productos</Link>
                </div>
            </div>
        </Layout>
    )
}

export default Department
