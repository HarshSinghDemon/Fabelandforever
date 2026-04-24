'use server';

/**
 * @fileOverview Server action to handle image uploads to Supabase Storage via REST API.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Basic validation
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: `Unsupported file type. Please use PNG, JPG, or WEBP.` };
  }

  const bucket = 'uploads';
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const filePath = `inspiration/${fileName}`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    return { 
      success: false, 
      error: 'Supabase credentials missing. Please check your .env file and ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.' 
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Clean the URL to ensure it's the base project URL
    const baseUrl = supabaseUrl.replace(/\/$/, '').replace('/storage/v1', '');
    const uploadUrl = `${baseUrl}/storage/v1/object/${bucket}/${filePath}`;

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
      if (response.status === 404) {
        throw new Error(`Bucket "${bucket}" not found. Please go to your Supabase Storage dashboard and create a bucket named "${bucket}".`);
      }
      const errorData = await response.json().catch(() => ({ message: `Upload failed with status ${response.status}` }));
      throw new Error(errorData.message || errorData.error || 'An error occurred during upload.');
    }

    // This URL works if the bucket is set to "Public"
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Supabase Upload Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred while weaving your image into storage.',
    };
  }
}
