

import TextInput from "@/Components/Form/TextInput"
import PrimaryButton from "@/Components/PrimaryButton"
import LayoutProfile from "../../Layouts/LayoutProfile"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { useState } from "react"
import InputLabel from "@/Components/Form/InputLabel"
import InputError from "@/Components/Form/InputError"
import SectionTitle from "@/Components/Sections/SectionTitle"
import { FormGrid } from "@/Components/Form/FormGrid"
const AccountDetails = () => {
	const { auth } = usePage().props

	const [notification, setNotifications] = useState({})
	const { data, setData, patch, processing, errors } = useForm({
		name: auth.user.name,
		phone: auth.user.phone,
		email: auth.user.email,
		email_confirmation: auth.user.email,
		city: auth.user.city,
		country: auth.user.country,
	})

	const handleSubmit = (e) => {
		e.preventDefault()
		patch(route('profile.account-details.update'), {
			preserveScroll: true
		})
	}
	return (
		<LayoutProfile hideSidebarOnMobile hideBreadcrumbOnMobile title="Detalles de Cuenta" breadcrumb={[
			{
				title: "Detalles de cuenta",
				path: route("profile.account-details")

			},
		]}>
			<Head title="Detalles de cuenta" />
			<div className="space-y-2 overflow-y-auto lg:overflow-visible">


				<form onSubmit={handleSubmit}>

					<FormGrid className="max-w-2xl gap-y-3 lg:gap-y-6">
						<div className="sm:col-span-3">
							<InputLabel>Nombre y Apellido *</InputLabel>
							<TextInput 
								className="w-full mt-2 !ring-0 !rounded-none !shadow-none border-b border-gray-200 !border-x-0 !border-t-0 !px-0 lg:!ring-1 lg:ring-inset lg:ring-neutral-300 lg:!rounded-md lg:!shadow-sm lg:!px-3" 
								onChange={(e) => setData('name', e.target.value)} 
								name="name" value={data.name} 
								placeholder={"Nombre y Apellido *"} />
							<InputError message={errors.name} />
						</div>
						<div className=" sm:col-span-3">
							<InputLabel>Telefono *</InputLabel>
						<TextInput className="w-full mt-2 !ring-0 !rounded-none !shadow-none border-b border-gray-200 !border-x-0 !border-t-0 !px-0 lg:!ring-1 lg:ring-inset lg:ring-neutral-300 lg:!rounded-md lg:!shadow-sm lg:!px-3" onChange={(e) => setData('phone', e.target.value)} name="phone" value={data.phone} placeholder={"Telefono *"} />
							<InputError message={errors.phone} />
						</div>
						<div className="sm:col-span-3">
							<InputLabel>Email *</InputLabel>
							<TextInput className="w-full mt-2 !ring-0 !rounded-none !shadow-none border-b border-gray-200 !border-x-0 !border-t-0 !px-0 lg:!ring-1 lg:ring-inset lg:ring-neutral-300 lg:!rounded-md lg:!shadow-sm lg:!px-3" type="email" onChange={(e) => setData('email', e.target.value)} name="email" value={data.email} placeholder={"Email *"} />
							<InputError message={errors.email} />
						</div>

						<div className="sm:col-span-3">
							<InputLabel>Confirmar Email *</InputLabel>
							<TextInput className="w-full mt-2 !ring-0 !rounded-none !shadow-none border-b border-gray-200 !border-x-0 !border-t-0 !px-0 lg:!ring-1 lg:ring-inset lg:ring-neutral-300 lg:!rounded-md lg:!shadow-sm lg:!px-3"
								type="email"
								onChange={(e) => setData('email_confirmation', e.target.value)}
								value={data.email_confirmation}
								name="email_confirmation"
								placeholder={"Confirmar Email *"}
							/>
						</div>
						<div className="text-center sm:col-span-6">
							<PrimaryButton 
							className="w-full bg-white text-primary-950 shadow-none border border-primary-950 rounded-none hover:bg-gray-50" 
							disabled={processing} 
							isLoading={processing}>
								Guardar
							</PrimaryButton>
						</div>
					</FormGrid>
				</form>
			</div>

			{/* Mobile logout */}
			<div className="lg:hidden mt-4">
				<Link
					method="post"
					as="button"
					href={route('logout')}
					className="w-full flex justify-center px-3.5 py-2.5 text-sm text-primary-400"
				>
					Cerrar Sesión
				</Link>
			</div>
		</LayoutProfile>
	)
}

export default AccountDetails
