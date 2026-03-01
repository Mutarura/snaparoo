import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    const event = await prisma.event.findUnique({
        where: { organizerToken: token },
        include: { _count: { select: { uploads: true } } },
    });
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    const fd = await req.formData();

    const galleryViewing = fd.get('galleryViewing') as string;
    const allowGuestGallery = fd.get('allowGuestGallery') === 'true';
    const filters = fd.get('filters') as string;
    const mediaLimitPerGuest = parseInt(fd.get('mediaLimitPerGuest') as string);

    const branding = {
        title: fd.get('title') as string,
        subtitle: fd.get('subtitle') as string,
        primaryColor: fd.get('primaryColor') as string,
    };

    try {
        const updated = await prisma.event.update({
            where: { organizerToken: token },
            data: {
                galleryViewing,
                allowGuestGallery,
                filters,
                mediaLimitPerGuest: isNaN(mediaLimitPerGuest) ? undefined : mediaLimitPerGuest,
                branding: JSON.stringify(branding),
            },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
