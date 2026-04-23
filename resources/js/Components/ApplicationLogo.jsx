
import { Link, usePage } from "@inertiajs/react";

export default function ApplicationLogo({ bgIcon = 'bg-primary-600', colorIcon = 'text-white', textColor = 'text-primary-950' }) {
    const { settings } = usePage().props
    return (
        <Link className="brand flex items-center" href={route('home')}>
            <span >
                <img 
                    src="/img/logo/logologo.png"  // Path to your image in public folder
                    alt="Logo"
                    className={'h-7 w-7 object-contain ' + colorIcon}
                />
            </span>
            <span className={"text-2xl font-semibold " + textColor}>
                {settings.company.name}
            </span>
        </Link>
    );
}