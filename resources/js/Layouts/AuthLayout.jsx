import NotificationToast from '@/Components/Notification/NotificationToast';

export default function AuthLayout({ children }) {
	return (
		<>
			<NotificationToast />
			<div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					{children}
				</div>
			</div>
		</>
	);
}
