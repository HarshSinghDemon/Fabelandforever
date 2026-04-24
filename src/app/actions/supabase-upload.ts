'use server';

/**
 * @fileOverview Secure server action to handle uploads to Supabase Storage.
 * Uses the service_role key to bypass RLS for administrative uploads while keeping the key hidden from the client.
 */

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const bucket = 'uploads'; // Ensure this bucket exists in Supabase
  const filePath = `inspiration/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl === 'your-supabase-project-url') {
    return { 
      success: false, 
      error: 'Supabase is not configured. Please add your URL and Service Role Key to the .env file.' 
    };
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

    // Public URL format per Supabase documentation
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