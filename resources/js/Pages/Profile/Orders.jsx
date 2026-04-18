
import { useState } from "react";
import { formatCurrency, formatDate } from "../../Helpers/helpers";


import LayoutProfile from "../../Layouts/LayoutProfile";
import OrderStatuBadges from "@/Components/OrderStatuBadges";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";

const Order = ({ orders }) => {

    const [page, setPage] = useState(1);

    const handleClickChangePage = (number) => {

        setPage(number);
    };

    return (
        <LayoutProfile hideSidebarOnMobile hideBreadcrumbOnMobile title="Pedidos" breadcrumb={[
            {
                title: "Ordenes",
                path: route("profile.orders")

            },
        ]}>
            <Head title="Pedidos" />


            {/* Desktop */}
            <div className="hidden lg:block space-y-2">
                <table className="table-list">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Status</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.map((item, key) => (
                            <tr key={key}>
                                <td>
                                    <span className="font-medium">#{item.code}</span>
                                </td>

                                <td>
                                    <Badge color={item.status_color} >{item.status}</Badge>
                                </td>
                                <td>
                                    {item.quantity}
                                </td>

                                <td>
                                    <span className="font-medium">{formatCurrency(item.total)}</span>
                                </td>
                                <td>
                                    {formatDate(item.created_at)}
                                    <span className='text-gray-500 block text-xs'>{item.createdAtRelative}</span>
                                </td>
                                <td className="px-4 text-start">
                                    <Link preserveScroll className="font-medium text-indigo-600" href={route('profile.order', item.code)}>Detalles</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-8">
                    {orders.meta.total > orders.meta.per_page && (
                        <Pagination paginator={orders.meta} />
                    )}
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-3">
                {orders.data.map((item, key) => (
                    <Link key={key} href={route('profile.order', item.code)} className="block bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-primary-600">Pedido #{item.code}</p>
                                <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                            </div>
                            <Badge color={item.status_color}>{item.status}</Badge>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                            </div>
                            <span className="text-sm font-medium text-indigo-600">Ver detalles &gt;</span>
                        </div>
                    </Link>
                ))}
                {orders.meta.total > orders.meta.per_page && (
                    <Pagination paginator={orders.meta} />
                )}
            </div>
        </LayoutProfile>
    );
};

export default Order;
