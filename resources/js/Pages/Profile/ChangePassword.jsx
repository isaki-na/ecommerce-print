
import InputLabel from "../../Components/Form/InputLabel"
import { Head, Link, useForm } from "@inertiajs/react"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/Form/TextInput"
import LayoutProfile from "../../Layouts/LayoutProfile"
import InputError from "@/Components/Form/InputError"
import { FormGrid } from "@/Components/Form/FormGrid"

const ChangePassword = () => {

	const { data, setData, put, errors, processing } = useForm({
		current_password: "",
		password: "",
		password_confirmation: "",
	})

	const handleSubmit = async (e) => {
		e.preventDefault()

		put(route('profile.password-update'), {
			preserveScroll: true
		})
	}

	return (
		<LayoutProfile hideSidebarOnMobile hideBreadcrumbOnMobile hideFooterOnMobile title="Cambiar contraseña" breadcrumb={[
			{
				title: "Cambio de contraseña",
				path: route("profile.password")

			},
		]}>
			<Head title="Cambio de contraseña" />
			<div className="space-y-2">
				<div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-100 py-2 mb-4">
					<Link
						href={route('profile.account-details')}
						className="inline-flex items-center text-sm font-medium text-primary-700"
					>
						Volver al perfil
					</Link>
				</div>

				<form onSubmit={handleSubmit}>
					<FormGrid className="max-w-2xl">
						<div className="sm:col-span-3">
							<InputLabel>Contraseña Actual *</InputLabel>
							<TextInput
								className="w-full mt-2"
								required={true}
								type="password"
								value={data.current_password}
								name="current_password"
								onChange={(e) => setData('current_password', e.target.value)}
							/>
							<InputError message={errors.current_password} />
						</div>

						<div className="sm:col-span-3">
							<InputLabel>Contraseña nueva*</InputLabel>
							<TextInput
								className="w-full mt-2"
								required={true}
								type="password"
								value={data.password}
								name="password"
								onChange={(e) => setData('password', e.target.value)}
							/>
							<InputError message={errors.password} />
						</div>
						<div className="sm:col-span-3">
							<InputLabel>Confirmar contraseña nueva*</InputLabel>
							<TextInput
								className="w-full mt-2"
								required={true}
								type="password"
								value={data.password_confirmation}
								name="password_confirmation"
								onChange={(e) => setData('password_confirmation', e.target.value)}
							/>
							<InputError message={errors.password_confirmation} />
						</div>

						<div className="w-full bg-white text-primary-950 shadow-none border border-primary-950 rounded-none hover:bg-gray-50">
							<PrimaryButton isLoading={processing} disabled={processing} >Guardar</PrimaryButton>
						</div>
					</FormGrid>

				</form>
			</div>
		</LayoutProfile>
	)
}

export default ChangePassword
