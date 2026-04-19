
import TextInput from "@/Components/Form/TextInput"
import Textarea from "@/Components/Form/Textarea"
import { FormGrid } from "@/Components/Form/FormGrid"
import InputLabel from "@/Components/Form/InputLabel"

import { useContext } from "react"
import { CheckoutContext } from "@/Components/Context/CheckoutProvider"
import { usePage } from "@inertiajs/react"
import InputError from "@/Components/Form/InputError"

const PickupContactInfo = () => {
    const { userForm } = useContext(CheckoutContext);
    const { errors } = usePage().props
    return (
        <>
            <div className="md:col-span-full pb-10 mb-10 border-b">
                <h3 className="text-lg font-medium mb-4">Información del contacto</h3>
                <InputLabel>Email</InputLabel>
                <TextInput
                    name="email"
                    required
                    onChange={(e) => userForm.setData('email', e.target.value)}
                    className="w-full"
                    value={userForm.data.email} />
                <InputError message={errors.email} className="mt-2" />
            </div>
            <div>
                <h3 className="text-lg font-medium mb-4">Información para recoger en tienda</h3>
                <FormGrid>
                    <div className="md:col-span-3">
                        <InputLabel>Nombre</InputLabel>
                        <TextInput
                            name="name"
                            required
                            onChange={(e) => userForm.setData('name', e.target.value)}
                            className="w-full"
                            value={userForm.data.name} />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="md:col-span-3">
                        <InputLabel>Telefono</InputLabel>
                        <TextInput
                            name="phone"
                            required
                            onChange={(e) => userForm.setData('phone', e.target.value)}
                            className="w-full"
                            value={userForm.data.phone} />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="md:col-span-6">
                        <InputLabel>Nota para recoger</InputLabel>
                        <Textarea name="note"
                            label="Nota para recoger"
                            onChange={(e) => userForm.setData('note', e.target.value)}
                            rows="3"
                            value={userForm.data.note} />
                        <InputError message={errors.note} className="mt-2" />
                    </div>

                </FormGrid>
            </div>
        </>

    )
}

export default PickupContactInfo
