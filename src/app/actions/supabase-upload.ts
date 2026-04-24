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

  // Crucial check: If keys are missing or placeholders, fail gracefully with a clear message
  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder') || supabaseUrl === 'undefined') {
    return { 
      success: false, 
      error: 'Supabase credentials are not configured. Please add your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the .env file.' 
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    // Sanitize URL construction
    const baseUrl = supabaseUrl.replace(/\/$/, '');
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
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Upload failed with status: ${response.status}`);
      } else {
        // If it's not JSON (like the HTML error you saw), get the status text
        const textError = await response.text();
        console.error('Supabase Non-JSON Error:', textError);
        throw new Error(`Supabase returned an error (${response.status}). Ensure the "uploads" bucket exists and your keys are correct.`);
      }
    }

    // Generate the public URL (Assumes the bucket is set to PUBLIC in Supabase)
    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

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
