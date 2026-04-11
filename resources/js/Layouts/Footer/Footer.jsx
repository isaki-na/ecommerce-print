import { Link, usePage } from "@inertiajs/react";
import Suscribe from "./Suscribe";
import ApplicationLogo from "@/Components/ApplicationLogo";
import SocilaMediaIcon from "./SocilaMediaIcon";
import SubscribeNewsletter from "./SubscribeNewsletter";

const Footer = () => {
    const { settings, departments } = usePage().props;

    const footerItems = [
        ];
    return (
        <>
            {/* <div className="container py-content">
                <Suscribe />
            </div> */}

            <footer className="pt-content">
                <div className="border-t ">
                    <div className="container   text-sm">
                        
                        HOLA TEST
                    </div>
                </div>
            </footer>
        </>
    );
};


export default Footer;
