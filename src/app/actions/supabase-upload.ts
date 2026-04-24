'use server';

/**
 * @fileOverview Server action to handle secure uploads to Supabase Storage.
 * This acts as the "Cloud Function" equivalent in a Next.js architecture.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  const bucket = 'uploads';
  const filePath = `inspiration/${Date.now()}-${file.name}`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  // Convert File to ArrayBuffer for the REST API
  const arrayBuffer = await file.arrayBuffer();

  // POST /storage/v1/object/{bucket}/{filePath}
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;

  try {
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

    // Public URL format: https://<project-id>.supabase.co/storage/v1/object/public/<bucket>/<filePath>
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Supabase Upload Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
