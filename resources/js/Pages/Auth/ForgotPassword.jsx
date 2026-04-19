import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/Form/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
	const { data, setData, post, processing, errors } = useForm({
		email: '',
	});

	const submit = (e) => {
		e.preventDefault();

		post(route('password.email'));
	};

	return (
		<AuthLayout>
			<Head title="Recuperar contraseña" />

			<div className="mb-6">
				<h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Recuperar contraseña
				</h2>
			</div>

			<div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
				¿Olvidaste tu contraseña? Ningún problema. Simplemente háganos saber su dirección de correo electrónico y le enviaremos un enlace de restablecimiento de contraseña que le permitirá elegir una nueva.
			</div>

			{status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

			<form onSubmit={submit}>
				<TextInput
					id="email"
					type="email"
					name="email"
					value={data.email}
					className="mt-1 block w-full"
					isFocused={true}
					onChange={(e) => setData('email', e.target.value)}
				/>

				<InputError message={errors.email} className="mt-2" />

				<div className="flex items-center justify-end mt-4">
					<PrimaryButton 
						className="w-full bg-black text-primary-50 shadow-none border border-primary-50 rounded-none hover:bg-gray-850" 
						disabled={processing} 
						isLoading={processing}>
						Enviar enlace de recuperación
					</PrimaryButton>
				</div>
			</form>

			<div className="mt-6 text-center text-sm text-gray-600">
				<Link
					href={route('login')}
					className="font-medium text-primary-600 hover:text-primary-500 underline"
				>
					Volver al inicio de sesión
				</Link>
			</div>
		</AuthLayout>
	);
}
