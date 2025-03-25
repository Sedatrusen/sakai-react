/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { useTranslation } from 'react-i18next';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { t } = useTranslation();

    const model: AppMenuItem[] = [
        {
            label: t('menu:home'),
            items: [{ label: t('menu:dashboard'), icon: 'pi pi-fw pi-home', to: '/' }]
        },    
        {
            label: t('menu:pages'),
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: t('menu:auth'),
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: t('menu:login'),
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: t('menu:error'),
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: t('menu:access_denied'),
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },
                {
                    label: t('menu:crud'),
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: t('crud:products.title'),
                            icon: 'pi pi-fw pi-box',
                            to: '/pages/crud/products'
                        },
                        {
                            label: t('crud:suppliers.title'),
                            icon: 'pi pi-fw pi-truck',
                            to: '/pages/crud/suppliers'
                        },
                        {
                            label: t('crud:brands.title'),
                            icon: 'pi pi-fw pi-tag',
                            to: '/pages/crud/brands'
                        },
                        {
                            label: t('crud:models.title'),
                            icon: 'pi pi-fw pi-list',
                            to: '/pages/crud/models'
                        },
                        {
                            label: t('crud:batches.title'),
                            icon: 'pi pi-fw pi-layer',
                            to: '/pages/crud/batches'
                        },
                        {
                            label: t('crud:machines.title'),
                            icon: 'pi pi-fw pi-cog',
                            to: '/pages/crud/machines'
                        },
                        {
                            label: t('crud:components.title'),
                            icon: 'pi pi-fw pi-th-large',
                            to: '/pages/crud/components'
                        },
                        {
                            label: t('crud:batch_components.title'),
                            icon: 'pi pi-fw pi-link',
                            to: '/pages/crud/batch_components'
                        },
                        {
                            label: t('crud:locations.title'),
                            icon: 'pi pi-fw pi-map-marker',
                            to: '/pages/crud/locations'
                        },
                        {
                            label: t('crud:movements.title'),
                            icon: 'pi pi-fw pi-exchange',
                            to: '/pages/crud/movements'
                        },
                        {
                            label: t('crud:generated_models.title'),
                            icon: 'pi pi-fw pi-cube',
                            to: '/pages/crud/generated_models'
                        },
                        {
                            label: t('crud:stages.title'),
                            icon: 'pi pi-fw pi-list',
                            to: '/pages/crud/stages',
                            permission: 'STAGE_VIEW'
                        },
                        {
                            label: t('crud:stage_components.title'),
                            icon: 'pi pi-fw pi-list',
                            to: '/pages/crud/stage-components',
                            permission: 'STAGE_COMPONENT_VIEW'
                        },
                        {
                            label: t('crud:stage_generated_models.title'),
                            icon: 'pi pi-fw pi-cube',
                            to: '/pages/crud/stage-generated-models',
                            permission: 'STAGE_GENERATED_MODEL_VIEW'
                        }
                    ]
                },
                {
                    label: t('menu:users'),
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
