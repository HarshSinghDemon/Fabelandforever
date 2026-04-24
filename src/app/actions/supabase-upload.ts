'use server';

/**
 * @fileOverview Server action to handle image uploads to Supabase Storage.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: `Format ${file.type} is not supported.` };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { success: false, error: 'Supabase credentials missing.' };
  }

  const bucket = 'uploads';
  // Use a simple folder structure in the bucket
  const fileName = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Supabase error: ${response.statusText}`);
    }

    // Public URL format for Supabase Storage
    const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${fileName}`;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Supabase upload failed:', error);
    return { success: false, error: error.message };
  }
}
