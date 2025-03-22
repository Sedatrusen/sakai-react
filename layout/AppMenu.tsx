/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },    
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Products',
                            icon: 'pi pi-fw pi-box',
                            to: '/pages/crud/products'
                        },
                        {
                            label: 'Suppliers',
                            icon: 'pi pi-fw pi-truck',
                            to: '/pages/crud/suppliers'
                        },
                        {
                            label: 'Brands',
                            icon: 'pi pi-fw pi-tag',
                            to: '/pages/crud/brands'
                        },
                        {
                            label: 'Models',
                            icon: 'pi pi-fw pi-list',
                            to: '/pages/crud/models'
                        },
                        {
                            label: 'Batches',
                            icon: 'pi pi-fw pi-layer',
                            to: '/pages/crud/batches'
                        },
                        {
                            label: 'Machines',
                            icon: 'pi pi-fw pi-cog',
                            to: '/pages/crud/machines'
                        },
                        {
                            label: 'Components',
                            icon: 'pi pi-fw pi-th-large',
                            to: '/pages/crud/components'
                        }
                    ]
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-user',
                    to: '/users'
                }
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

                <Link href="https://blocks.primereact.org" target="_blank" style={{ cursor: 'pointer' }}>
                    <img alt="Prime Blocks" className="w-full mt-3" src={`/layout/images/banner-primeblocks${layoutConfig.colorScheme === 'light' ? '' : '-dark'}.png`} />
                </Link>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
