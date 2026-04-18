import { Link, useForm, usePage } from '@inertiajs/react'
import {
    ClipboardDocumentListIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MovileNavbar({ navigation }) {
    const { filters, categories = [] } = usePage().props
    const { data, setData, get } = useForm({
        q: filters?.q || '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        get('/search', {
            preserveScroll: true,
        })
    }

    const bottomNavigation = [
        {
            name: 'Inicio',
            href: route('home'),
            current: route().current('home') || route().current('category'),
            icon: HomeIcon,
        },
        {
            name: 'Pedidos',
            href: route('profile.orders'),
            current: route().current('profile.orders'),
            icon: ClipboardDocumentListIcon,
        },
        {
            name: 'Carrito',
            href: route('shopping-cart.index'),
            current: route().current('shopping-cart.index'),
            icon: ShoppingBagIcon,
        },
        {
            name: 'Perfil',
            href: route('profile.account-details'),
            current: route().current('profile.account-details') || route().current('profile.index'),
            icon: UserCircleIcon,
        },
    ]

    const hideSearchOnMobile = route().current('profile.orders') || route().current('shopping-cart.index') || route().current('profile.account-details') || route().current('profile.index')

    return (
        <>
            {!hideSearchOnMobile && <nav className="border-b bg-primary-50 lg:hidden sticky top-0 z-30">
                <div className="px-3 py-3">
                    <form onSubmit={handleSubmit} className="overflow-hidden border-2 bg-white flex rounded-lg shadow-sm">
                        <input
                            id="search-mobile"
                            type="text"
                            name="q"
                            value={data.q}
                            onChange={e => setData('q', e.target.value)}
                            className="block w-full border-none bg-transparent ring-0 focus:ring-0 text-sm"
                            autoComplete="search"
                            placeholder="Buscar"
                            required
                        />
                        <button type="submit" className="inline-flex items-center px-3 text-primary-500">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                <div className="border-t border-primary-100 px-2 pb-2">
                    <div className="flex gap-x-4 overflow-x-auto flex-nowrap scroll-smooth scrollbar-hide w-full pt-2">
                        <LinkNavbar href={route('home')} active={route().current('home')}>
                            Todos
                        </LinkNavbar>

                        {categories.map((category) => (
                            <LinkNavbar
                                key={category.slug}
                                href={route('category', category.slug)}
                                active={route().current('category', category.slug)}
                            >
                                {category.name}
                            </LinkNavbar>
                        ))}
                    </div>
                </div>
            </nav>}

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur lg:hidden">
                <div className="grid grid-cols-4">
                    {bottomNavigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                'flex flex-col items-center justify-center py-2 text-[11px] gap-y-1',
                                item.current ? 'text-primary-700' : 'text-neutral-400'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

function LinkNavbar({ children, active, ...props }) {
    return (
        <Link
            {...props}
            className={
                (active
                    ? 'border-primary-950 text-primary-950 font-semibold border-b-2'
                    : 'text-primary-600') +
                ' whitespace-nowrap block pb-1 text-sm'
            }
        >
            {children}
        </Link>
    )
}