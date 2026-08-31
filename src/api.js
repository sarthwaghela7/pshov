import { createClient } from '@supabase/supabase-js';

// Vite only exposes variables prefixed with VITE_ to browser code. Keep all
// client-side service configuration here so the app has one clear source.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'website-images';

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;


function contentTable(type) {
  if (type !== 'ventures' && type !== 'services') {
    throw new Error(`Unsupported content type: ${type}`);
  }
  return type;
}

export async function getContent(type) {
  const table = contentTable(type);
  if (!supabase) return [];

  const { data, error } = await supabase.from(table).select('*').order('display_order', { ascending: true });
  if (error) {
    console.warn(`Could not load ${table} from Supabase.`, error.message);
    return [];
  }
  return data;
}

export const getVentures = () => getContent('ventures');
export const getServices = () => getContent('services');

const defaultContactSettings = {
  primary_email: 'hello@psonkarventures.com',
  primary_whatsapp: '+919876543210',
  linkedin_url: 'https://linkedin.com/in/pratapsonkar',
  instagram_url: 'https://instagram.com/psonkarventures',
  twitter_url: 'https://twitter.com/pratapsonkar',
  location: 'Bangalore, Karnataka, India',
};

export async function getContactSettings() {
  if (!supabase) return defaultContactSettings;
  const { data, error } = await supabase.from('contact_settings').select('*').eq('id', 1).maybeSingle();
  if (error) {
    console.warn('Could not load contact settings from Supabase.', error.message);
    return defaultContactSettings;
  }
  return { ...defaultContactSettings, ...data };
}

export async function saveContactSettings(settings) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.');
  const payload = {
    id: 1,
    primary_email: settings.primary_email?.trim() || null,
    primary_whatsapp: settings.primary_whatsapp?.trim() || null,
    linkedin_url: settings.linkedin_url?.trim() || null,
    instagram_url: settings.instagram_url?.trim() || null,
    twitter_url: settings.twitter_url?.trim() || null,
    location: settings.location?.trim() || null,
  };
  const { data, error } = await supabase.from('contact_settings').upsert(payload).select().single();
  if (error) {
    if (error.code === '42P01' || error.message?.includes('contact_settings')) {
      throw new Error('Contact settings table is missing. Run the contact_settings section from supabase/schema.sql in Supabase SQL Editor, then refresh the admin panel.');
    }
    throw error;
  }
  return data;
}

export function createWhatsAppUrl(phone, message) {
  return `https://wa.me/${(phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith('/')) return imagePath;
  const normalizedPath = imagePath.replace(new RegExp(`^${storageBucket}/`), '').replace(/^\/+/, '');
  return supabase?.storage.from(storageBucket).getPublicUrl(normalizedPath).data.publicUrl || imagePath;
}

export const getSession = () => supabase?.auth.getSession();
export const signIn = (email, password) => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured. Restart the Vite dev server after checking your .env file.'));
  return supabase.auth.signInWithPassword({ email, password });
};
export const signUp = (email, password) => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured.'));
  return supabase.auth.signUp({ email, password });
};
export const signOut = () => {
  if (!supabase) return Promise.reject(new Error('Supabase is not configured.'));
  return supabase.auth.signOut();
};

export async function requestPasswordReset(email) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const redirectTo = `${window.location.origin}${window.location.pathname}?reset=password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
  if (error) throw error;
}

export async function resetPassword(password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data.user;
}

// Use an isolated client so creating a new admin never replaces the current
// administrator's session in this browser.
export async function createAdminAuthUser(email, password) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Supabase is not configured.');
  const authClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await authClient.auth.signUp({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
  // With email confirmation enabled, Supabase returns an empty identities list
  // when sign-up is attempted for an email that already has an Auth account.
  // Surface that case instead of reporting that a new account was created.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('An account already exists for this email. Leave the temporary password blank to grant that user admin access.');
  }
  return data;
}

export async function hasAdminAccess() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.rpc('is_active_admin');
  if (error) throw error;
  return data === true;
}

export async function getAdminAccess() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('admin_access').select('*').order('email');
  if (error) throw error;
  return data;
}

export async function saveAdminAccess(email) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const normalizedEmail = email.trim().toLowerCase();
  let { data, error } = await supabase
    .from('admin_access')
    .upsert({ email: normalizedEmail, is_active: true, revoked_at: null }, { onConflict: 'email' })
    .select()
    .single();
  // Lets an already-deployed panel keep granting access until the optional
  // revoked_at migration has been applied.
  if (error?.code === '42703' || error?.message?.includes('revoked_at')) {
    ({ data, error } = await supabase
      .from('admin_access')
      .upsert({ email: normalizedEmail, is_active: true }, { onConflict: 'email' })
      .select()
      .single());
  }
  if (error) throw error;
  return data;
}

export async function setAdminAccess(email, isActive) {
  if (!supabase) throw new Error('Supabase is not configured.');
  let { data, error } = await supabase.rpc('set_admin_access_status', {
    target_email: email.trim().toLowerCase(),
    next_is_active: isActive,
  });
  // The existing RLS policy safely permits changing another admin's status.
  // Use it while the new RPC migration is being deployed.
  if (error?.code === 'PGRST202' || error?.code === '42883' || error?.message?.includes('set_admin_access_status')) {
    ({ data, error } = await supabase
      .from('admin_access')
      .update({ is_active: isActive })
      .eq('email', email.trim().toLowerCase())
      .select()
      .single());
  }
  if (error) throw error;
  return data;
}

// Credentials are updated in Supabase Auth (auth.users), never in a public
// application table. Supabase stores passwords securely as hashes.
export async function updateAdminCredentials({ email, password }) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const currentUser = sessionData.session?.user;
  if (!currentUser) throw new Error('Your admin session has expired. Please sign in again.');

  const updates = {};
  const nextEmail = email?.trim();
  if (nextEmail && nextEmail !== currentUser.email) updates.email = nextEmail;
  if (password) updates.password = password;
  if (Object.keys(updates).length === 0) return currentUser;

  const { data, error } = await supabase.auth.updateUser(updates);
  if (error) throw error;
  return data.user;
}

export async function saveContent(type, item) {
  const table = contentTable(type);
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.');

  const payload = {
    name: item.name,
    description: item.description,
    image_url: item.image_url || null,
    detail_image_url: item.detail_image_url || null,
    landing_image_url: item.landing_image_url || null,
    is_active: item.is_live !== false,
    display_order: Number(item.display_order) || 0,
    ...(table === 'ventures' ? { website_url: item.website_url || null } : {}),
  };
  const query = item.id
    ? supabase.from(table).update(payload).eq('id', item.id).select().single()
    : supabase.from(table).insert(payload).select().single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteContent(type, id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from(contentTable(type)).delete().eq('id', id);
  if (error) throw error;
}

export async function uploadImage(file, type) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (type !== 'ventures' && type !== 'services') throw new Error('Choose ventures or services before uploading an image.');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error('Your admin session has expired. Please sign in again.');
  const extension = file.name.split('.').pop();
  const path = `${type}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(storageBucket).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(`Image upload failed for bucket "${storageBucket}": ${error.message}`);
  return supabase.storage.from(storageBucket).getPublicUrl(path).data.publicUrl;
}
