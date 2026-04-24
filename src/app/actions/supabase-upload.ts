'use server';

/**
 * @fileOverview Server action to handle secure uploads to Supabase Storage.
 * This acts as the secure bridge to Supabase while keeping keys on the server.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const bucket = 'uploads';
  const filePath = `inspiration/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase configuration missing');
    return { success: false, error: 'Storage service is not configured.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // REST API call to Supabase Storage
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': file.type,
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload to Supabase');
    }

    // Format the public URL for retrieval
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Supabase Upload Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during upload.',
    };
  }
}
