import { CheckoutContext } from '@/Components/Context/CheckoutProvider'
import InputLabel from '@/Components/Form/InputLabel'
import InputError from '@/Components/Form/InputError'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/Form/TextInput'
import { useForm } from '@inertiajs/react'
import React from 'react'
import { useContext } from 'react'
import SecondaryButton from '@/Components/SecondaryButton'

const InputDiscount = () => {

    const { data, setData, post, errors, processing, reset } = useForm({
        discountCode: '',
    })

    const handleSubmitDiscount = (e) => {
        e.preventDefault()
        post(route('checkout.apply-discount'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('discountCode')
            }
        })
    }
    return (
        <>
            <form onSubmit={handleSubmitDiscount} className=" ">
                <InputLabel>Código de descuento</InputLabel>
                <div className="flex items-stretch gap-x-3 mt-2">
                    <TextInput
                        name="discountCode"
                        required
                        onChange={(e) => setData('discountCode', e.target.value)}
                        className=" uppercase"

                        value={data.discountCode} />
                    <PrimaryButton isLoading={processing} disabled={processing} >Aplicar</PrimaryButton>
                </div>
            </form>
            <InputError className="mt-1.5" message={errors.discountCode} />
        </>
    )
}

export default InputDiscount
