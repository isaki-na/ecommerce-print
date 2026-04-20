import ApplicationLogo from '@/Components/ApplicationLogo';
import Navbar from '@/Layouts/Navbar/Navbar';
import { Link, usePage } from '@inertiajs/react';
import Footer from './Footer/Footer';
import NotificationToast from '@/Components/Notification/NotificationToast';

export default function Layout({ children, hideFooter = false, hideFooterOnMobile = false }) {
	const { auth } = usePage().props
	return (
		<>
			<NotificationToast />

			<Navbar auth={auth} />
			<main>{children}</main>
			{!hideFooter && (
				<div className={hideFooterOnMobile ? 'hidden lg:block' : ''}>
					<Footer />
				</div>
			)}

		</>
	);
}