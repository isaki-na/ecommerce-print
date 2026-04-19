import { Link, useForm, usePage } from '@inertiajs/react'
import {
    ClipboardDocumentListIcon,
    FunnelIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import Modal from '@/Components/Modal'
import Filters from '@/Pages/Search/Filters/Filters'
import { SearchContext } from '@/Pages/Search/SearchContext'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function MovileNavbar({ navigation }) {
    const pageProps = usePage().props
    const { filters, categories = [] } = pageProps
    const [openFilters, setOpenFilters] = useState(false)
    const firstFilterRender = useRef(true)
    const { data, setData, get } = useForm({
        q: filters?.q || '',
    })
    const filtersForm = useForm({
        q: filters?.q || '',
        sortBy: filters?.sortBy || '',
        departments: filters?.departments || [],
        categories: filters?.categories || [],
        colors: filters?.colors || [],
        sizes: filters?.sizes || [],
        attributes: filters?.attributes || {},
        price_min: filters?.price_min || '',
        price_max: filters?.price_max || '',
        offer: filters?.offer || null,
    })

    function handleSubmit(e) {
        e.preventDefault()
        get('/search', {
            preserveScroll: true,
        })
    }

    const isSearchRoute = route().current('search')
    const isHomeRoute = route().current('home')
    const isCategoryRoute = route().current('category')
    const hasFilterData =
        Array.isArray(pageProps.listDepartments) &&
        Array.isArray(pageProps.listCategories) &&
        Array.isArray(pageProps.listColors) &&
        Array.isArray(pageProps.listSizes)
    const showMobileFilterButton = isSearchRoute || isHomeRoute || isCategoryRoute

    const handleMobileFilters = () => {
        if (hasFilterData) {
            setOpenFilters(true)
            return
        }

        get('/search', {
            preserveScroll: true,
        })
    }

    useEffect(() => {
        if (!isSearchRoute) {
            return
        }

        if (firstFilterRender.current) {
            firstFilterRender.current = false
            return
        }

        filtersForm.get('/search', {
            preserveScroll: true,
            preserveState: true,
        })
    }, [filtersForm.data, isSearchRoute])

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

    const hideSearchOnMobile = route().current('profile.orders') || route().current('shopping-cart.index') || route().current('profile.account-details') || route().current('profile.index') || route().current('profile.order') || route().current('product') || route().current('checkout')
    const hideBottomNavigationOnMobile = route().current('profile.order')

    return (
        <>
            {!hideSearchOnMobile && <nav className="border-b bg-primary-50 lg:hidden sticky top-0 z-30">
                <div className="px-3 py-3">
                    <div className="flex items-stretch gap-2">
                        <form onSubmit={handleSubmit} className="overflow-hidden border-2 bg-white flex rounded-lg shadow-sm flex-1">
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

                        {showMobileFilterButton && (
                            <button
                                type="button"
                                onClick={handleMobileFilters}
                                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-200 bg-white px-3 text-primary-600 shadow-sm"
                                aria-label="Abrir filtros"
                            >
                                <FunnelIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
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

            {isSearchRoute && hasFilterData && (
                <Modal show={openFilters} onClose={() => setOpenFilters(false)} maxWidth="lg">
                    <div className="p-4">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                            <h3 className="text-base font-semibold text-gray-900">Filtros</h3>
                            <button
                                type="button"
                                onClick={() => setOpenFilters(false)}
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                                aria-label="Cerrar filtros"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-2 max-h-[70vh] overflow-y-auto pr-1">
                            <SearchContext.Provider value={filtersForm}>
                                <Filters />
                            </SearchContext.Provider>
                        </div>
                    </div>
                </Modal>
            )}

            {!hideBottomNavigationOnMobile && (
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
            )}
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
                    : 'text-primary-600 font-medium') +
                ' whitespace-nowrap block pb-1 text-sm'
            }
        >
            {children}
        </Link>
    )
}