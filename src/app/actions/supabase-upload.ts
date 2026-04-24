'use server';

export async function uploadToSupabase(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

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
      error: 'Supabase credentials missing. Check your .env file.' 
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

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
        throw new Error('Bucket "uploads" not found. Please create it in your Supabase Storage dashboard.');
      }
      const errorData = await response.json().catch(() => ({ message: `Upload failed (${response.status})` }));
      throw new Error(errorData.message || errorData.error || 'Upload failed');
    }

    const publicUrl = `${baseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error: any) {
    console.error('Supabase Upload Error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred.',
    };
  }
}
