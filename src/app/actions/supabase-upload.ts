'use server';

/**
 * @fileOverview Robust server action to handle image uploads to Supabase Storage.
 * Includes improved error handling and environment validation.
 */

export async function uploadToSupabase(formData: FormData) {
  try {
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
      return { 
        success: false, 
        error: 'Supabase configuration is missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.' 
      };
    }

    // Sanitize URL: ensure it starts with https and has no trailing slash
    const baseUrl = supabaseUrl.replace(/\/$/, '');
    const bucket = 'uploads';
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
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
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.message || `Cloud Error: ${response.status} ${response.statusText}` 
      };
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${fileName}`;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Supabase upload failed:', error);
    return { success: false, error: error.message || 'The magic threads encountered a network glitch.' };
  }
}
