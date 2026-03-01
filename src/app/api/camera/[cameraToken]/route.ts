import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get event by cameraToken (for guest camera page)
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ cameraToken: string }> }
) {
    const { cameraToken } = await params;
    const event = await prisma.event.findUnique({
        where: { cameraToken },
        select: {
            id: true,
            name: true,
            branding: true,
            filters: true,
            mediaLimitPerGuest: true,
            allowGuestGallery: true,
            galleryViewing: true,
            backgroundPoster: true,
            cameraToken: true,
            _count: { select: { uploads: true } },
        },
    });
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
}

// Record an upload by guest
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ cameraToken: string }> }
) {
    const { cameraToken } = await params;
    const { participantId } = await req.json();

    const event = await prisma.event.findUnique({ where: { cameraToken } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    // Check current upload count for this participant
    const participantUploads = await prisma.upload.count({
        where: { eventId: event.id, participantId },
    });

    if (participantUploads >= event.mediaLimitPerGuest) {
        return NextResponse.json({ error: 'Media limit reached' }, { status: 403 });
    }

    await prisma.upload.create({
        data: { eventId: event.id, participantId },
    });

    // Update uniqueParticipants count
    const uniqueCount = await prisma.upload.groupBy({
        by: ['participantId'],
        where: { eventId: event.id },
    });
    await prisma.event.update({
        where: { id: event.id },
        data: { uniqueParticipants: uniqueCount.length },
    });

    return NextResponse.json({ success: true, uploadsLeft: event.mediaLimitPerGuest - participantUploads - 1 });
}
