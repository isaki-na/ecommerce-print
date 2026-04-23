import { formatCurrency } from "@/Helpers/helpers";

const OrderSummaryMobile = ({ total }) => {
    return (
        <div className="space-y-3 border-y border-gray-200 py-5">
            <div className="grid grid-cols-2 gap-x-4 text-sm">
                <div className="text-gray-600">Subtotal</div>
                <div className="text-right text-gray-700">{formatCurrency(total.sub_total)}</div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 text-2xl font-semibold leading-none pt-2 border-t border-gray-200">
                <div>Total</div>
                <div className="text-right">{formatCurrency(total.total)}</div>
            </div>
        </div>
    );
};

export default OrderSummaryMobile;
