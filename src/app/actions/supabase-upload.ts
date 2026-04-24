'use server';

/**
 * @fileOverview Refined server action to handle image uploads to Supabase Storage.
 * Improved to prevent HTML error parsing issues and handle binary data correctly.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Support common web image types
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: `Format ${file.type} is not supported. Use PNG, JPG, or WEBP.` };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    return { 
      success: false, 
      error: 'Credentials missing. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correctly saved in your .env file.' 
    };
  }

  const bucket = 'uploads';
  const fileName = `inspiration/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Normalize URL
    const baseUrl = supabaseUrl.replace(/\/$/, '').replace('/storage/v1', '');
    const uploadUrl = `${baseUrl}/storage/v1/object/${bucket}/${fileName}`;

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
      const responseText = await response.text();
      let errorMessage = `Supabase Error (${response.status})`;
      
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        if (responseText.includes('<!DOCTYPE html>')) {
          errorMessage = "Supabase returned an HTML error. This usually means the URL is wrong or the bucket 'uploads' doesn't exist.";
        }
      }
      throw new Error(errorMessage);
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${fileName}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Supabase Upload Failure:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during the weaving process.',
    };
  }
}
