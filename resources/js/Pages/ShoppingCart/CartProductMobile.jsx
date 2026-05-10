import InputError from "@/Components/Form/InputError";
import Spinner from "@/Components/Spinner";
import { formatCurrency } from "@/Helpers/helpers";
import { Link, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";

const CartProductMobile = ({ cardProduct }) => {
    const { data, setData, delete: destroy, post, processing, errors } = useForm({
        quantity: cardProduct.quantity,
        skuId: cardProduct.skuId,
    });

    const handleChangeQuantity = (e) => {
        setData('quantity', e.target.value);
    };

    const handleClickRemoveItem = () => {
        destroy(route('shopping-cart.destroy', cardProduct.skuId), {
            preserveScroll: true,
        });
    };

    const handleIncreaseQuantity = () => {
        const current = Number(data.quantity);
        if (current >= Number(cardProduct.max_quantity)) {
            return;
        }
        setData('quantity', current + 1);
    };

    const handleDecreaseQuantity = () => {
        const current = Number(data.quantity);
        if (current <= 1) {
            return;
        }
        setData('quantity', current - 1);
    };

    const first = useRef(true);
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }

        post(route('shopping-cart.store'), {
            preserveScroll: true,
        });
    }, [data]);

    return (
        <div className="relative py-5">
            {processing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                    <Spinner />
                </div>
            )}

            <div className="flex gap-3">
                <Link
                    href={route('product', { slug: cardProduct.slug, ref: cardProduct.ref })}
                    className="shrink-0"
                >
                    <img
                        className="h-24 w-16 object-cover"
                        src={cardProduct.thumb || cardProduct.img || "/img/placeholder.png"}
                        alt={cardProduct.name}
                        onError={(e) => {
                            if (e.currentTarget.src.includes('/img/placeholder.png')) return;
                            e.currentTarget.src = '/img/placeholder.png';
                        }}
                    />
                </Link>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 leading-tight">
                        {cardProduct.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <span>Color: {cardProduct.color?.name ?? '-'}</span>
                        {cardProduct.size && (
                            <>
                                <span className="h-4 w-px bg-gray-300" aria-hidden="true"></span>
                                <span>Talla: {cardProduct.size.name}</span>
                            </>
                        )}
                    </div>

                    <div className="mt-2 text-2xl font-medium leading-none text-gray-900">
                        {formatCurrency(cardProduct.total)}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        disabled={processing || Number(data.quantity) <= 1}
                        className="h-6 w-6 border border-gray-300 text-gray-500 disabled:opacity-40"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        max={cardProduct.max_quantity}
                        disabled={processing}
                        onChange={handleChangeQuantity}
                        value={data.quantity}
                        className="h-6 w-8 border-0 bg-transparent p-0 text-center text-sm text-gray-700 focus:ring-0"
                    />
                    <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        disabled={processing || Number(data.quantity) >= Number(cardProduct.max_quantity)}
                        className="h-6 w-6 border border-gray-300 text-gray-500 disabled:opacity-40"
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleClickRemoveItem}
                    className="text-sm font-medium text-red-500"
                >
                    Eliminar
                </button>
            </div>

            <InputError className="mt-1.5" message={errors.quantity} />
            <InputError className="mt-1.5" message={errors.product_id} />
        </div>
    );
};

export default CartProductMobile;
