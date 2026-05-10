
import { Link } from '@inertiajs/react'
import React from 'react'


const ColorVariants = ({ product, variants, returnTo = null, source = null, sourceCategory = null }) => {
    // console.log(variants)
    return (
        <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Variantes</h3>
            <div className='flex gap-4 flex-wrap'>
                {variants.map((variant) => (
                    (() => {
                        const variantLabel = variant.color?.name || 'Variante';
                        return variant.inStock > 0 ? (
                            <Link
                                preserveScroll
                                key={variant.id}
                                href={route("product", {
                                    slug: variant.slug,
                                    ref: variant.ref,
                                    return_to: returnTo,
                                    source,
                                    source_category: sourceCategory,
                                })}
                                className={"rounded-md overflow-hidden  " +
                                    (
                                        product.id == variant.id
                                            ? "ring-2 ring-primary-500 "
                                            : 'hover:ring-2 hover:ring-primary-500'
                                    )}
                            >
                                <span
                                    className="inline-flex min-w-16 items-center justify-center px-3 py-2 text-xs font-medium uppercase bg-white text-gray-900"
                                    title={variantLabel}
                                >
                                    {variantLabel}
                                </span>
                            </Link>
                        ) : (
                            <div className='relative' key={variant.id}>
                                <span
                                    className="inline-flex min-w-16 items-center justify-center px-3 py-2 text-xs font-medium uppercase bg-gray-100 text-gray-400"
                                    title={variantLabel}
                                >
                                    {variantLabel}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-300"
                                >
                                    <svg
                                        stroke="currentColor"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-300"
                                    >
                                        <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                                    </svg>
                                </span>
                            </div>
                        );
                    })()
                ))}
            </div>
        </div>
    )
}

export default ColorVariants
