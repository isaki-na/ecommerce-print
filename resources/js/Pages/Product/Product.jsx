import Layout from '@/Layouts/Layout'
import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import ImagesProduct from './ImagesProduct'
import Description from './Description'
import CarouselProduct from './CarouselProduct'
import Breadcrumb from '@/Components/Breadcrumb'
import SectionTitle from '@/Components/Sections/SectionTitle'
import TitlePrice from './TitlePrice'

import { formatCurrency } from '@/Helpers/helpers'
import VariantsProduct from './Variants/VariantsProduct'
import ColorVariants from './Variants/ColorVariants'
import MetaTag from '@/Components/MetaTag'
import SelectSkuSize from './Variants/SelectSkuSize'
import SelectQuantity from './Variants/SelectQuantity'
import InputError from '@/Components/Form/InputError'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

function MobileColorVariants({ product, variants, returnTo = null, source = null, sourceCategory = null }) {
    return (
        <div className="pt-2">
            <h3 className="text-xs tracking-wide uppercase text-gray-500">Color</h3>
            <div className="mt-3 flex gap-3 flex-wrap">
                {variants.map((variant) => (
                    variant.inStock > 0 ? (
                        <Link
                            preserveScroll
                            key={variant.id}
                            href={route('product', {
                                slug: variant.slug,
                                ref: variant.ref,
                                return_to: returnTo,
                                source,
                                source_category: sourceCategory,
                            })}
                            className={
                                'rounded-full size-7 p-[2px] border flex items-center justify-center ' +
                                (product.id == variant.id ? 'border-gray-900' : 'border-gray-300')
                            }
                            aria-label={variant.color.name}
                            title={variant.color.name}
                        >
                            <span
                                className="w-full h-full rounded-full inline-block border border-gray-200"
                                style={
                                    variant.color.img
                                        ? { backgroundImage: 'url(' + variant.color.img + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
                                        : { backgroundColor: variant.color.hex || '#e5e7eb' }
                                }
                            ></span>
                        </Link>
                    ) : (
                        <div
                            key={variant.id}
                            className="rounded-full size-7 p-[2px] border border-gray-200 opacity-40 flex items-center justify-center"
                            title={variant.color.name}
                        >
                            <span
                                className="w-full h-full rounded-full inline-block border border-gray-200"
                                style={
                                    variant.color.img
                                        ? { backgroundImage: 'url(' + variant.color.img + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
                                        : { backgroundColor: variant.color.hex || '#e5e7eb' }
                                }
                            ></span>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default function Product({ product, variants, relatedProducts }) {
    const { url } = usePage()
    const [selectedSkuSize, setSelectedSkuSize] = useState(null)
    const mobileForm = useForm({
        quantity: 1,
        skuId: null,
    })

    useEffect(() => {
        const firstAvailable = product.skus.find((sku) => sku.stock > 0)
        if (firstAvailable) {
            setSelectedSkuSize(firstAvailable)
        }
    }, [product.skus])

    useEffect(() => {
        if (selectedSkuSize) {
            mobileForm.setData((data) => ({
                ...data,
                quantity: 1,
                skuId: selectedSkuSize.id,
            }))
        } else {
            mobileForm.setData((data) => ({
                ...data,
                quantity: 1,
                skuId: null,
            }))
        }
    }, [selectedSkuSize])

    const handleMobileAddToCart = () => {
        mobileForm.post(route('shopping-cart.store'), {
            preserveScroll: true,
        })
    }

    const handleBack = () => {
        const currentQuery = new URLSearchParams((url.split('?')[1] || ''))
        const returnTo = currentQuery.get('return_to')
        const source = currentQuery.get('source')
        const sourceCategory = currentQuery.get('source_category')

        const visitTarget = (target) => {
            router.visit(target, {
                preserveScroll: true,
            })
        }

        if (returnTo && !returnTo.includes('/product')) {
            visitTarget(returnTo)
            return
        }

        if (source === 'category' && sourceCategory) {
            visitTarget(route('category', sourceCategory))
            return
        }

        if (source === 'home') {
            visitTarget(route('home'))
            return
        }

        if (product?.category?.slug) {
            visitTarget(route('category', product.category.slug))
            return
        }

        visitTarget(route('home'))
    }

    const currentQuery = new URLSearchParams((url.split('?')[1] || ''))
    const returnTo = currentQuery.get('return_to')
    const source = currentQuery.get('source')
    const sourceCategory = currentQuery.get('source_category')

    const mobileMaxQuantity = selectedSkuSize
        ? Math.min(product.max_quantity, selectedSkuSize.stock)
        : product.max_quantity

    let breadcrumb = [
        {
            title: product.category.name,
            path: route("search", { 'categories[]': product.category.id })
        },

        {
            title: product.name
        }]
    return (
        <Layout>
            <MetaTag metaTag={product.metaTag} />
            <Breadcrumb hideMobile data={breadcrumb} />

            <div className="container lg:hidden pb-40">
                <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 py-4 text-sm text-gray-600"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Regresar
                </button>

                <div className="rounded-sm overflow-hidden bg-gray-100">
                    <img src={product.img} alt={product.name} className="w-full aspect-[3/4] object-cover object-top" />
                </div>

                <div className="bg-neutral-100 mt-4 p-4 space-y-5">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
                        <p className="text-2xl font-semibold mt-1">{formatCurrency(product.price)}</p>
                        <p className="text-sm text-gray-500 mt-2">SKU: {product.ref}</p>
                    </div>

                    {variants.length > 1 && <MobileColorVariants product={product} variants={variants} returnTo={returnTo} source={source} sourceCategory={sourceCategory} />}

                    {product.skus.length > 1 && (
                        <div className="pt-1 border-t border-gray-200">
                            <SelectSkuSize
                                skuSizes={product.skus}
                                selectedSkuSize={selectedSkuSize}
                                setSelectedSkuSize={setSelectedSkuSize}
                            />
                        </div>
                    )}

                    <div className="pt-1 border-t border-gray-200">
                        <SelectQuantity maxQuantity={mobileMaxQuantity} selectedSkuSize={selectedSkuSize} form={mobileForm} />
                        <InputError className="mt-3" message={mobileForm.errors.quantity} />
                        <InputError className="mt-3" message={mobileForm.errors.product_id} />
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                </div>
            </div>

            <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur px-4 pt-3 pb-6">
                <button
                    type="button"
                    onClick={handleMobileAddToCart}
                    disabled={!mobileForm.data.skuId || mobileForm.processing}
                    className="w-full bg-gray-900 text-white font-semibold py-3 uppercase tracking-wide disabled:opacity-40"
                >
                    Añadir al pedido
                </button>
            </div>

            <div className="container ">
                <div className="hidden lg:flex flex-col-reverse lg:flex-row py-content gap-10">
                    <div className=" w-full lg:w-7/12">
                        <ImagesProduct product={product} />
                    </div>
                    <div className="w-full lg:w-5/12 ">
                        <TitlePrice product={product} />
                        <div className='space-y-6'>
                            {variants.length > 1 && (
                                <ColorVariants product={product} variants={variants} returnTo={returnTo} source={source} sourceCategory={sourceCategory} />
                            )}
                            <VariantsProduct />

                        </div>
                    </div>

                </div>
                <div className="hidden lg:block w-full lg:w-9/12">
                    <Description product={product} />
                </div>
                <div className="hidden lg:block py-content">
                    <SectionTitle title="Productos relacionados" />
                    <div className="mt-5">
                        <CarouselProduct products={relatedProducts} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
