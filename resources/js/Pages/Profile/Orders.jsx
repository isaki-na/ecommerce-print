
import { formatCurrency, formatDate } from "../../Helpers/helpers";


import LayoutProfile from "../../Layouts/LayoutProfile";
import OrderStatuBadges from "@/Components/OrderStatuBadges";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import Badge from "@/Components/Badge";

const ORDER_AGE_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "12m", label: "Ultimo año" },
    { value: "6m", label: "Ultimos 6 meses" },
    { value: "3m", label: "Ultimos 3 meses" },
    { value: "1m", label: "Ultimo mes" },
];

const Order = ({ orders, filters = {} }) => {
    const selectedAge = filters.age || "all";

    const handleAgeFilterChange = (e) => {
        router.get(route("profile.orders"), {
            age: e.target.value,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    return (
        <LayoutProfile hideSidebarOnMobile hideBreadcrumbOnMobile title="Pedidos" breadcrumb={[
            {
                title: "Ordenes",
                path: route("profile.orders")

            },
        ]}>
            <Head title="Pedidos" />

            <div className="mb-5 flex justify-end">
                <div className="w-full lg:w-auto">
                    <label htmlFor="orders-age-filter" className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
                        Antiguedad
                    </label>
                    <select
                        id="orders-age-filter"
                        name="age"
                        value={selectedAge}
                        onChange={handleAgeFilterChange}
                        className="w-full lg:w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
                    >
                        {ORDER_AGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>


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
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-900">Pedido #{item.code}</p>
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
