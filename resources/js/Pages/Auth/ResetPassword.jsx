import { useEffect } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		token: token,
		email: email,
		password: '',
		password_confirmation: '',
	});

	useEffect(() => {
		return () => {
			reset('password', 'password_confirmation');
		};
	}, []);

	const submit = (e) => {
		e.preventDefault();

		post(route('password.store'));
	};

	return (
		<AuthLayout>
			<Head title="Restablecer contraseña" />

			<div className="mb-6">
				<h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Restablecer contraseña
				</h2>
			</div>

			<form onSubmit={submit}>
				<div>
					<InputLabel htmlFor="email" value="Email" />

					<TextInput
						id="email"
						type="email"
						name="email"
						value={data.email}
						className="mt-1 block w-full"
						autoComplete="username"
						onChange={(e) => setData('email', e.target.value)}
					/>

					<InputError message={errors.email} className="mt-2" />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="password" value="Nueva contraseña" />

					<TextInput
						id="password"
						type="password"
						name="password"
						value={data.password}
						className="mt-1 block w-full"
						autoComplete="new-password"
						isFocused={true}
						onChange={(e) => setData('password', e.target.value)}
					/>

					<InputError message={errors.password} className="mt-2" />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />

					<TextInput
						type="password"
						name="password_confirmation"
						value={data.password_confirmation}
						className="mt-1 block w-full"
						autoComplete="new-password"
						onChange={(e) => setData('password_confirmation', e.target.value)}
					/>

					<InputError message={errors.password_confirmation} className="mt-2" />
				</div>

				<div className="flex items-center justify-end mt-4">
					<PrimaryButton className="w-full flex justify-center" disabled={processing}>
						Restablecer contraseña
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
