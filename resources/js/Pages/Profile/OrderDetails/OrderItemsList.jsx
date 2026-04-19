
import { formatCurrency } from '@/Helpers/helpers'
import React from 'react'

function OrderItemsList({ order }) {

    return (
        <div>
            <div className="space-y-3 lg:hidden">
                {order.products.map((product, index) => (
                    <article key={index} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex gap-3">
                            <img className="h-24 w-16 shrink-0 rounded object-cover" src={product.thumb} alt={product.name} />

                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-gray-900 leading-tight">
                                    {product.name}
                                </h3>

                                <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-gray-500">
                                    <span>Color {product.color.name}</span>
                                    {product.size && (
                                        <>
                                            <span className="h-3 w-px bg-gray-300" aria-hidden="true"></span>
                                            <span>Talla {product.size.name}</span>
                                        </>
                                    )}
                                </div>

                                <div className="mt-2">
                                    <PriceOffer price={product.price} old_price={product.old_price} offer={product.offer} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 border-t border-gray-100 pt-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">Cantidad</p>
                                <p className="text-sm font-medium text-gray-900">{product.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wide text-gray-400">Monto</p>
                                <p className="text-base font-semibold text-gray-900">{formatCurrency(product.total)}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="hidden lg:block">
                <table className="table-list">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Item</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((product, index) => (
                            <tr key={index}>
                                <td className='whitespace-nowrap'>
                                    <img className="h-16 max-w-full rounded " src={product.thumb} alt={product.name} />

                                </td>
                                <td className='align-top'>
                                    {product.name}
                                    <div key={index} className='flex gap-x-1.5 text-xs mt-1 text-gray-500'>
                                        <div>Color {product.color.name}</div>
                                        {product.size && (
                                            <div className='border-l border-gray-300 pl-1.5'> Talla {product.size.name}</div>
                                        )}

                                    </div>
                                </td>
                                <td className='whitespace-nowrap' >
                                    <PriceOffer price={product.price}
                                        old_price={product.old_price}
                                        offer={product.offer} />
                                </td>
                                <td>{product.quantity}</td>
                                <td className='whitespace-nowrap'>{formatCurrency(product.total)}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div >
    )
}

function PriceOffer({ price, old_price, offer }) {
    return (
        <div className='text-sm'>
            <span >
                {formatCurrency(price)}
            </span>
            {(offer > 0) && (
                <div className='flex gap-x-1'>
                    <div className="inline-block text-green-500 text-xs font-semibold">
                        -{offer}%
                    </div>
                    <div className="text-xs text-gray-400 line-through">
                        {formatCurrency(old_price)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrderItemsList
