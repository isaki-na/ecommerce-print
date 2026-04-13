import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { ChevronUpDownIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import React from 'react'

import { Link, useForm, usePage } from '@inertiajs/react';

import ProfileDropdown from './ProfileDropdown';
import DepartmentDropdown from './DepartmentDropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { formatCurrency } from '@/Helpers/helpers';

export default function DesktopNavbar({ navigation }) {

    const { auth, filters, categories, settings } = usePage().props // Changed from departments to categories
    const { data, setData, get, processing, errors, reset } = useForm({
        q: filters?.q || null,
    })

    function handleSubmit(e) {
        e.preventDefault()
        get('/search', {
            preserveScroll: true,
            //onSuccess: () => reset('q'),
        })
    }
    
    return (
        <nav className="border-b hidden lg:block"> 
            <div className="container pt-4 text-neutral-700 text-sm">
                <div className='relative grid grid-cols-12 gap-x-5 items-center'>
                    <div className='col-span-3'>
                        <ApplicationLogo />
                    </div>

                    <div className="w-full md:col-span-7">
                        <div>
                            <form onSubmit={handleSubmit} className="overflow-hidden border-2 border-primary-600 bg-primary-600 flex rounded-lg shadow-sm">
                                <input
                                    id="search-main"
                                    type="text"
                                    name="q"
                                    onChange={e => setData('q', e.target.value)}
                                    className="block w-full border-none focus:border-none ring-0 focus:ring-none focus:ring-0"
                                    autoComplete="search"
                                    required
                                />
                                <button type="submit" className="inline-flex items-center px-3 text-sm text-white">
                                    <MagnifyingGlassIcon className="w-6 h-6" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className='h-14 pt-2 flex justify-between items-center'>
                    <div className="flex items-center">
                        <div className='hidden xl:block'>
                            <div className='ml-5 flex gap-x-4'>
                                {categories.map((category) => ( // Changed from departments to categories
                                    <LinkNavbar 
                                        key={category.slug} 
                                        href={route('category', category.slug)} // Changed route from 'department' to 'category'
                                        active={route().current('category', category.slug)} // Changed route check
                                    >
                                        {category.name}
                                    </LinkNavbar>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-x-5 items-center">
                        {auth.user ? (
                            <ProfileDropdown>
                                <button className="inline-flex items-center">
                                    {auth.user.name}
                                    <ChevronUpDownIcon className="w-5 h-5 ml-1 -mr-1" aria-hidden="true" />
                                </button>
                            </ProfileDropdown>
                        ) : (
                            <>
                                <div className="flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-2">
                                    <Link href={route('login')} className="hover:">Acceder</Link>
                                    <span className="h-4 w-px bg-neutral-400" aria-hidden="true"></span>
                                    <Link href={route('register')} className="hover:">Crear cuenta</Link>
                                </div>
                            </>
                        )}

                        <Link href={route('shopping-cart.index')}>
                            <div className='group -m-2 flex items-center p-2'>
                                <ShoppingBagIcon
                                    aria-hidden="true"
                                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                    {auth.shoppingCartCount}
                                </span>
                                <span className="sr-only">items in cart, view bag</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function LinkNavbar({ children, active, ...props }) {
    return (
        <Link {...props}
            className={
                (active
                    ? 'border-primary-950 text-primary-950 font-medium border-b-2'
                    : '') +
                'text-primary-600 whitespace-nowrap block '
            }>
            {children}
        </Link>
    )
}