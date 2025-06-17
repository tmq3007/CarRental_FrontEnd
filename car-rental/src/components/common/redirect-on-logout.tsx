'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/lib/store';

export default function RedirectOnLogout() {
    const router = useRouter();
    const pathname = usePathname();
    const user_email = useSelector((state: RootState) => state.user.email);

    useEffect(() => {
        const isExcluded = pathname === '/car-rent' || pathname === '/car-rent/home';

        if (!user_email && !isExcluded) {
            router.push('/signin');
        }
    }, [user_email, pathname]);

    return null;
}
