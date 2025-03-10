/* eslint-disable @next/next/no-img-element */

'use client';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'primereact/button';
import { useLanguage } from '../app/contexts/LanguageContext';

interface AppTopbarProps {
    items?: any[];
}

const AppTopbar = forwardRef<AppTopbarRef>((props: AppTopbarProps, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const { user, logout } = useAuth();
    const { t, currentLanguage, changeLanguage } = useLanguage();
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex gap-2 mr-2">
                    <Button
                        icon="pi pi-globe"
                        text
                        severity={currentLanguage === 'en' ? 'info' : 'secondary'}
                        onClick={() => changeLanguage('en')}
                        className="p-button-sm"
                    >
                        EN
                    </Button>
                    <Button
                        icon="pi pi-globe"
                        text
                        severity={currentLanguage === 'tr' ? 'info' : 'secondary'}
                        onClick={() => changeLanguage('tr')}
                        className="p-button-sm"
                    >
                        TR
                    </Button>
                </div>

                <button className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>{t('menu.dashboard')}</span>
                </button>
                <button className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>{t('menu.profile')}</span>
                </button>
                <button className="p-link layout-topbar-button">
                    <i className="pi pi-cog"></i>
                    <span>{t('menu.settings')}</span>
                </button>

                {user && (
                    <>
                        <span className="mr-3">Welcome, {user.name}</span>
                        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-danger" onClick={logout} tooltip="Logout" />
                    </>
                )}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
