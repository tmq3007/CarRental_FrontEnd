import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {

    console.log("Hello logout")

    try {
        // Get Cookies
        const cookie = await cookies();

        cookie.delete("Access_Token");

        return NextResponse.redirect(new URL('/signin', req.url), { status: 307 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
