import { useEffect } from 'react';
import AuthLayout from '@/Layouts/AuthLayout';
import InputError from '@/Components/Form/InputError';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/Form/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: '',
		email: '',
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

		post(route('register'));
	};

	return (
		<AuthLayout>
			<Head title="Registro" />

			<div className="mb-6">
				<h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Crear una nueva cuenta
				</h2>
			</div>

			<form onSubmit={submit}>
				<div>
					<InputLabel htmlFor="name" value="Nombre" />

					<TextInput
						id="name"
						name="name"
						value={data.name}
						className="mt-1 block w-full"
						autoComplete="name"
						isFocused={true}
						onChange={(e) => setData('name', e.target.value)}
						required
					/>

					<InputError message={errors.name} className="mt-2" />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="email" value="Email" />

					<TextInput
						id="email"
						type="email"
						name="email"
						value={data.email}
						className="mt-1 block w-full"
						autoComplete="username"
						onChange={(e) => setData('email', e.target.value)}
						required
					/>

					<InputError message={errors.email} className="mt-2" />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="password" value="Contraseña" />

					<TextInput
						id="password"
						type="password"
						name="password"
						value={data.password}
						className="mt-1 block w-full"
						autoComplete="new-password"
						onChange={(e) => setData('password', e.target.value)}
						required
					/>

					<InputError message={errors.password} className="mt-2" />
				</div>

				<div className="mt-4">
					<InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />

					<TextInput
						id="password_confirmation"
						type="password"
						name="password_confirmation"
						value={data.password_confirmation}
						className="mt-1 block w-full"
						autoComplete="new-password"
						onChange={(e) => setData('password_confirmation', e.target.value)}
						required
					/>

					<InputError message={errors.password_confirmation} className="mt-2" />
				</div>

				<div className="flex items-center justify-end mt-4">
					<PrimaryButton 
						className="w-full bg-black text-primary-50 shadow-none border border-primary-50 rounded-none hover:bg-gray-850" 
						disabled={processing}>
							Registrar
					</PrimaryButton>
				</div>
			</form>

			<div className="mt-6 text-center text-sm text-gray-600">
				¿Ya tienes una cuenta?{' '}
				<Link
					href={route('login')}
					className="font-medium text-primary-600 hover:text-primary-500"
				>
					Inicia sesión aquí
				</Link>
			</div>
		</AuthLayout>
	);
}
