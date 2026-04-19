

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Head, Link, usePage } from "@inertiajs/react";
import LayoutProfile from "../../../Layouts/LayoutProfile";
import SectionTitle from "@/Components/Sections/SectionTitle";
import { ArrowDownTrayIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import BuyerDetails from "./BuyerDetails";
import OrderItemsList from "./OrderItemsList";
import OrderTotalPrice from "./OrderTotalPrice";
import Badge from "@/Components/Badge";


const OderDetails = ({ order }) => {
    const { flash } = usePage().props

    return (
        <LayoutProfile hideSidebarOnMobile hideBreadcrumbOnMobile>
            <Head title={"Pedido #" + order.code} />

            <div className="space-y-8">
                <div className="sm:hidden">
                    <Link
                        preserveScroll
                        href={route('profile.orders')}
                        className="btn btn-secondary inline-flex items-center gap-2"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Volver a pedidos
                    </Link>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SectionTitle className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">
                        <span>Pedido: # {order.code}</span>
                        <Badge color={order.status_color}>{order.status}</Badge>
                    </SectionTitle>
                    <div className="inline-flex gap-x-2">

                        <a className="btn btn-secondary inline-flex w-full justify-center items-center gap-x-2 sm:w-auto" target="_black" href={route('profile.invoice', order.code)}>
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            Descargar factura
                        </a>

                    </div>
                </div>
                {flash.success && (
                    <div >
                        <div className="bg-green-100 p-2 md:p-4 flex items-start space-x-2 rounded-md">
                            <div>
                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="text-green-700 flex-grow">
                                <span className="font-semibold block text-green-600">
                                    Gracias. Tu orden ha sido recibida.
                                </span>
                                <span className="text-green-600 ">
                                    {flash.success}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invoice */}

                <BuyerDetails order={order} />

                <OrderItemsList order={order} />

                <OrderTotalPrice order={order} />


            </div>
        </LayoutProfile >
    )
}



export default OderDetails
