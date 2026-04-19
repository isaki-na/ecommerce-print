import React from 'react'
import { formatCurrency, formatDate } from "../../../Helpers/helpers";
function OrderTotalPrice({ order }) {
    return (
        <div className="mt-8">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:hidden">
                <div className="space-y-3 text-sm">
                    <dl className="flex items-center justify-between gap-3">
                        <dt className="text-gray-600">Sub total</dt>
                        <dd className="font-medium text-gray-900">{formatCurrency(order.sub_total)}</dd>
                    </dl>
                    {order.discount && (
                        <dl className="flex items-center justify-between gap-3">
                            <dt className="text-gray-600">Descuento ({order.discount.value}%)</dt>
                            <dd className="font-medium text-green-600">-{formatCurrency(order.discount.applied)}</dd>
                        </dl>
                    )}
                    <dl className="flex items-center justify-between gap-3">
                        <dt className="text-gray-600">Envio</dt>
                        <dd className="font-medium text-gray-900">{formatCurrency(order.shipping)}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-3">
                        <dt className="text-gray-600">Impuestos ({order.tax_rate}%)</dt>
                        <dd className="font-medium text-gray-900">{formatCurrency(order.tax_value)}</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-base">
                        <dt className="font-semibold text-gray-900">Total</dt>
                        <dd className="font-bold text-gray-900">{formatCurrency(order.total)}</dd>
                    </dl>
                </div>
            </div>

            <div className="hidden sm:flex sm:justify-end pr-3">
                <div className="sm:text-right space-y-4">
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 text-gray-500">Sub total</dt>
                        <dd className="whitespace-nowrap col-span-2 font-medium">{formatCurrency(order.sub_total)}</dd>
                    </dl>
                    {order.discount && (
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 text-gray-500">Descuento ({order.discount.value}%)</dt>
                            <dd className="whitespace-nowrap col-span-2 font-medium text-green-500">-{formatCurrency(order.discount.applied)}</dd>
                        </dl>
                    )}
                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 text-gray-500">Envio</dt>
                        <dd className="whitespace-nowrap col-span-2 font-medium">{formatCurrency(order.shipping)}</dd>
                    </dl>

                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 text-gray-500">Estimación de impuestos {order.tax_rate}%</dt>
                        <dd className="whitespace-nowrap col-span-2 font-medium">{formatCurrency(order.tax_value)}</dd>
                    </dl>

                    <dl className="grid sm:grid-cols-5 gap-x-3">
                        <dt className="col-span-3 text-gray-500">Total</dt>
                        <dd className="whitespace-nowrap col-span-2 font-bold">{formatCurrency(order.total)}</dd>
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default OrderTotalPrice
