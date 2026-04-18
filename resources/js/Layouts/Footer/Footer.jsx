import { Link, usePage } from "@inertiajs/react";
import Suscribe from "./Suscribe";
import ApplicationLogo from "@/Components/ApplicationLogo";
import SocilaMediaIcon from "./SocilaMediaIcon";
import SubscribeNewsletter from "./SubscribeNewsletter";

const Footer = () => {
    const { settings, departments } = usePage().props;

    const footerItems = [
        ];
    const hideFooterOnMobile = route().current('profile.orders') || route().current('shopping-cart.index') || route().current('profile.account-details') || route().current('profile.index')

    return (
        <>
            {/* <div className="container py-content">
                <Suscribe />
            </div> */}

            <footer className={'pt-content' + (hideFooterOnMobile ? ' hidden lg:block' : '')}>
                <div className="border-t ">
                    <div className="container   text-sm">
                         <ApplicationLogo/>
                    </div>
                </div>
            </footer>
        </>
    );
};


export default Footer;
