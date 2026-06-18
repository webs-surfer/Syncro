import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
    try{
        const projects = await prisma.project.findMany();
        return NextResponse.json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: 'Database connection error',
        }, {
            status: 500,
        });
    }
}