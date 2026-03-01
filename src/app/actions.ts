'use server'

import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

export async function createEvent(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const dateStr = formData.get('date') as string;
  const plan = formData.get('plan') as string;

  const endDateStr = formData.get('endDate') as string;
  const guestLimit = parseInt(formData.get('guestLimit') as string) || 10;
  const galleryViewing = formData.get('galleryViewing') as string || 'During';
  const filters = formData.get('filters') as string || 'None';
  const allowGuestGallery = formData.get('allowGuestGallery') === 'true';
  const backgroundPoster = formData.get('backgroundPoster') as string || '';

  // Basic validation
  if (!name || !email || !dateStr || !plan) {
    return { message: 'Missing required fields' };
  }

  const date = new Date(dateStr);
  const organizerToken = uuidv4();
  const cameraToken = uuidv4().slice(0, 8); // Shorter token for camera URL

  try {
    const event = await prisma.event.create({
      data: {
        name,
        email,
        date,
        endDate: endDateStr ? new Date(endDateStr) : null,
        plan,
        organizerToken,
        cameraToken,
        paymentStatus: 'PAID', // Mocking successful payment
        maxUploads: plan === 'Basic' ? 50 : plan === 'Premium' ? 200 : 1000,
        guestLimit,
        galleryViewing,
        filters,
        allowGuestGallery,
        backgroundPoster
      },
    });

    // In a real app, we would send an email here.
    console.log(`Email sent to ${email} with dashboard link: /dashboard/${organizerToken}`);

    return {
      success: true,
      redirectUrl: `/dashboard/${organizerToken}`,
      message: 'Event created successfully!'
    };

  } catch (e) {
    console.error(e);
    return { message: 'Failed to create event' };
  }
}

export async function updateEventBranding(token: string, formData: FormData) {
  const branding = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    primaryColor: formData.get('primaryColor'),
    font: formData.get('font'),
    showVintage: formData.get('showVintage') === 'on',
  };

  const p_galleryViewing = formData.get('galleryViewing') as string;
  const p_allowGuestGallery = formData.get('allowGuestGallery') === 'on' || formData.get('allowGuestGallery') === 'true';
  const p_filters = formData.get('filters') as string;
  const p_mediaLimitPerGuest = parseInt(formData.get('mediaLimitPerGuest') as string);
  const p_backgroundPoster = formData.get('backgroundPoster') as string;

  try {
    const updateData: any = {
      branding: JSON.stringify(branding),
    };

    if (p_galleryViewing !== null) updateData.galleryViewing = p_galleryViewing;
    if (formData.has('allowGuestGallery')) updateData.allowGuestGallery = p_allowGuestGallery;
    if (p_filters !== null) updateData.filters = p_filters;
    if (!isNaN(p_mediaLimitPerGuest)) updateData.mediaLimitPerGuest = p_mediaLimitPerGuest;
    if (p_backgroundPoster !== null) updateData.backgroundPoster = p_backgroundPoster;

    await prisma.event.update({
      where: { organizerToken: token },
      data: updateData,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update branding' };
  }
}

export async function getEventByToken(token: string) {
  return await prisma.event.findUnique({
    where: { organizerToken: token },
    include: {
      _count: {
        select: { uploads: true }
      }
    }
  });
}
