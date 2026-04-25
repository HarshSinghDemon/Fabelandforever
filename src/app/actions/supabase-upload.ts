'use server';

/**
 * @fileOverview Robust server action to handle image uploads to Supabase Storage.
 * Now hard-linked with provided credentials for failsafe connection.
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

    // Hard-linked credentials for absolute stability
    const supabaseUrl = "https://qigxixiekbdkeperulpk.supabase.co";
    const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ3hpeGlla2Jka2VwZXJ1bHBrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAxOTE2MiwiZXhwIjoyMDkyNTk1MTYyfQ.7Ggumc9g9ukhII8pKcoHmQV7DAeK2t4DU8AvmBEwXRA";

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
      if (response.status === 404) {
        return { 
          success: false, 
          error: `Bucket "${bucket}" not found. Please ensure it exists and is public in Supabase.` 
        };
      }
      return { 
        success: false, 
        error: errorData.message || `Cloud Error: ${response.status}` 
      };
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Supabase upload failed:', error);
    return { success: false, error: error.message || 'The magic threads encountered a cloud glitch.' };
  }
}