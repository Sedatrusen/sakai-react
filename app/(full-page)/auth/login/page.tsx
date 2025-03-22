/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const { login } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError(t('common.error.required'));
            return;
        }

        try {
            await login(email, password);
            router.push('/pages/crud');
        } catch (err) {
            setError(t('common.error.invalid'));
        }
    };

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden');

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{t('common.welcomeBack')}</div>
                            <span className="text-600 font-medium">{t('common.signInToContinue')}</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    {t('common.email')}
                                </label>
                                <InputText
                                    id="email1"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('common.emailPlaceholder')}
                                    className="w-full md:w-30rem mb-5"
                                    style={{ padding: '1rem' }}
                                />

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    {t('common.password')}
                                </label>
                                <Password
                                    inputId="password1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('common.passwordPlaceholder')}
                                    toggleMask
                                    className="w-full mb-5"
                                    inputClassName="w-full p-3 md:w-30rem"
                                ></Password>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">Remember me</label>
                                    </div>
                                </div>
                                {error && <div className="text-red-500 mb-5">{error}</div>}
                                <Button label={t('common.signIn')} className="w-full p-3 text-xl" type="submit"></Button>
                            </div>
                        </form>

                        <div className="mt-5">
                            <div className="text-center text-xl">{t('common.testAccounts')}</div>
                            <div className="grid mt-3 text-sm">
                                <div className="col-12 sm:col-4">
                                    <div className="text-900 font-medium mb-2">Admin</div>
                                    <div>admin@demo.com</div>
                                    <div>admin123</div>
                                </div>
                                <div className="col-12 sm:col-4">
                                    <div className="text-900 font-medium mb-2">Manager</div>
                                    <div>manager@demo.com</div>
                                    <div>manager123</div>
                                </div>
                                <div className="col-12 sm:col-4">
                                    <div className="text-900 font-medium mb-2">User</div>
                                    <div>user@demo.com</div>
                                    <div>user123</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
