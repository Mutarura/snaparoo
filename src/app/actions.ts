'use server'

import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

export async function createEvent(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const dateStr = formData.get('date') as string;
  const plan = formData.get('plan') as string;
  
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
        plan,
        organizerToken,
        cameraToken,
        paymentStatus: 'PAID', // Mocking successful payment
        maxUploads: plan === 'Basic' ? 50 : plan === 'Premium' ? 200 : 1000, // Based on plan
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

  try {
    await prisma.event.update({
      where: { organizerToken: token },
      data: {
        branding: JSON.stringify(branding),
      },
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
