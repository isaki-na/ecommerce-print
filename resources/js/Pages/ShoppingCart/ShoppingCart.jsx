import SectionList from "@/Components/Sections/SectionList"
import Layout from "@/Layouts/Layout"
import CartProduct from "./CartProduct"
import CartProductMobile from "./CartProductMobile"
import OrderSummary from "./OrderSummary"
import OrderSummaryMobile from "./OrderSummaryMobile"
import PrimaryButton from "@/Components/PrimaryButton"
import { Head, router, useForm } from "@inertiajs/react"

const paymentMethods = [
    {
        id: "in_store",
        name: "Pagar y recoger en tienda",
        details: null,
        enabled: true,
    },
    {
        id: "online_pickup",
        name: "Pagar online y recoger en tienda",
        details: "Tarjeta y transferencia (proximamente)",
        enabled: false,
    },
]

const ShoppingCart = ({ products, total, selectedPaymentMethod = "in_store" }) => {

    const { get, processing } = useForm();

    const handleSelectPaymentMethod = (paymentMethod) => {
        if (paymentMethod === selectedPaymentMethod) {
            return
        }

        router.get(route('shopping-cart.index'), {
            payment_method: paymentMethod,
        }, {
            preserveScroll: true,
        })
    }

    const handleClickCheckout = () => {
        get(route('checkout.add-shopping-cart', {
            payment_method: selectedPaymentMethod,
        }))
    }

    return (
        <Layout>
            <Head title="Carrito de compras" />
            <div className="container relative pb-36 lg:pb-0">
                <div className="mx-auto max-w-5xl space-y-4">
                    <div className="lg:hidden">
                        <div className="mx-auto w-full max-w-md overflow-hidden rounded-t-3xl border border-gray-200 bg-gray-50">
                            <div className="border-b border-gray-200 px-4 py-5 text-center">
                                <h1 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">Bolsa de compras</h1>
                            </div>

                            {products.length ? (
                                <>
                                    <div className="divide-y divide-gray-200 px-4">
                                        {products.map((product) => (
                                            <CartProductMobile cardProduct={product} key={product.ref} />
                                        ))}
                                    </div>

                                    <div className="px-4">
                                        <OrderSummaryMobile total={total} />

                                        <div className="mt-6 border border-gray-300 bg-white px-4 py-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-900">Metodo de pago</p>

                                            <div className="mt-3 space-y-2">
                                                {paymentMethods.map((method) => (
                                                    <button
                                                        key={method.id}
                                                        type="button"
                                                        onClick={() => method.enabled && handleSelectPaymentMethod(method.id)}
                                                        disabled={!method.enabled || processing}
                                                        className={
                                                            "w-full rounded-md border px-3 py-2 text-left text-sm transition " +
                                                            (selectedPaymentMethod === method.id
                                                                ? "border-gray-900 bg-gray-900 text-white"
                                                                : "border-gray-300 bg-white text-gray-700") +
                                                            (!method.enabled ? " cursor-not-allowed opacity-45" : "")
                                                        }
                                                    >
                                                        <span className="block">{method.name}</span>
                                                        {method.details && (
                                                            <span className={
                                                                "mt-1 block text-xs " +
                                                                (selectedPaymentMethod === method.id ? "text-gray-100" : "text-gray-500")
                                                            }>
                                                                {method.details}
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-600">No hay productos en el carrito de compra</div>
                            )}
                        </div>

                        {products.length > 0 && (
                            <div className="fixed inset-x-0 bottom-16 z-30 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-sm">
                                <div className="mx-auto w-full max-w-md">
                                    <PrimaryButton
                                        onClick={handleClickCheckout}
                                        isLoading={processing}
                                        disabled={processing}
                                        className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                                    >
                                        Confirmar pedido
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block">
                        <SectionList title="Carrito de compra">
                            <div className=" divide-y divide-gray-200 ">
                                {products.map((product) => (
                                    <CartProduct cardProduct={product} key={product.ref} />
                                ))}
                            </div>

                            {products.length ? (
                                <>
                                    <div>
                                        <OrderSummary total={total} />
                                    </div>
                                    <div className="text-right mt-6 ">
                                        <PrimaryButton onClick={handleClickCheckout} isLoading={processing} disabled={processing}>Comprar ahora</PrimaryButton>
                                    </div>
                                </>
                            ) : (
                                <span>No hay productos en el carrito de compra</span>
                            )}
                        </SectionList>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ShoppingCart
