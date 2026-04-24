'use server';

/**
 * @fileOverview Secure server action to handle uploads to Supabase Storage using REST API.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Basic validation for common image types
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: `Unsupported file type: ${file.type}. Please use PNG, JPG, or WEBP.` };
  }

  const bucket = 'uploads'; // Ensure this bucket exists in your Supabase Dashboard
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = `inspiration/${fileName}`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    return { 
      success: false, 
      error: 'Supabase credentials missing. Please check your .env file.' 
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // REST API call to Supabase Storage: POST /storage/v1/object/{bucket}/{path}
    const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${filePath}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true', // Allows overwriting if necessary
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Supabase REST Error:', errorData);
      throw new Error(errorData.message || errorData.error || 'Failed to upload to Supabase');
    }

    // Generate the public URL (Assumes the bucket is set to PUBLIC in Supabase)
    const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Upload Action Failure:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during the upload process.',
    };
  }
}
