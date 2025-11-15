import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function POST(req: NextRequest, res: NextResponse) {

    try {
        const { jti, email } = await req.json()

        //Check Redis jti key
        const redisKey = `Forgot_Password_JTI:${email}`;
        const jtiRedis = await redis.get(redisKey);

        if (!jtiRedis || jtiRedis !== jti) {
            return NextResponse.json({ message: 'Used' }, { status: 404 });
        }

        console.log("Been here")

        return NextResponse.json({ message: 'Okay' }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
}