
'use server';
import { addContactMessage } from '@/lib/firestore';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
});

export async function contactAction(prevState: any, formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
        message: 'Invalid form data. Please check your entries.',
        errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await addContactMessage(parsed.data);
    return {
      message: 'Your message has been successfully sent! We will get back to you shortly.',
    }
  } catch (error) {
     console.error('Error saving contact message:', error);
     return {
        message: 'There was an error sending your message. Please try again.',
     }
  }
}
