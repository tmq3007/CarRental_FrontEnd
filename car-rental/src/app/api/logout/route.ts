import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {

    console.log("Hello logout")

    try {
        // Get Cookies
        const cookie = await cookies();

        cookie.delete("Access_Token");

        return NextResponse.json({ message: 'Cookies cleared successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
