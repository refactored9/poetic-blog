import { Blog, BlogFormData, Journey } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Blog APIs
export async function getAllBlogs(): Promise<Blog[]> {
  const response = await fetchApi<{ data: Blog[] }>('/blogs');
  return response.data;
}

export async function getPublishedBlogs(): Promise<Blog[]> {
  const response = await fetchApi<{ data: Blog[] }>('/blogs?published=true');
  return response.data;
}

export async function getFeaturedBlogs(): Promise<Blog[]> {
  const response = await fetchApi<{ data: Blog[] }>('/blogs?published=true');
  return response.data.filter(blog => blog.featured);
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const response = await fetchApi<{ data: Blog }>(`/blogs/${slug}`);
  return response.data;
}

export async function getBlogById(id: string): Promise<Blog> {
  const response = await fetchApi<{ data: Blog }>(`/blogs/${id}`);
  return response.data;
}

export async function createBlog(data: BlogFormData): Promise<Blog> {
  return fetchApi<Blog>('/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBlog(id: string, data: Partial<BlogFormData>): Promise<Blog> {
  return fetchApi<Blog>(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await fetchApi(`/blogs/${id}`, {
    method: 'DELETE',
  });
}

// Journey APIs
export async function getAllJourneys(): Promise<Journey[]> {
  return fetchApi<Journey[]>('/journeys');
}

export async function getPublishedJourneys(): Promise<Journey[]> {
  return fetchApi<Journey[]>('/journeys?published=true');
}

export async function getJourneyById(id: string): Promise<Journey> {
  return fetchApi<Journey>(`/journeys/${id}`);
}

export async function createJourney(data: Omit<Journey, 'id'>): Promise<Journey> {
  return fetchApi<Journey>('/journeys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJourney(id: string, data: Partial<Journey>): Promise<Journey> {
  return fetchApi<Journey>(`/journeys/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteJourney(id: string): Promise<void> {
  await fetchApi(`/journeys/${id}`, {
    method: 'DELETE',
  });
}

// Image upload
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  const result = await response.json();

  // If it's an S3 URL (starts with http), return as-is
  // Otherwise, prepend the base URL for local storage
  if (result.url.startsWith('http')) {
    return result.url;
  }
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${result.url}`;
}

// Upload multiple images
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  const result = await response.json();
  const baseUrl = API_BASE_URL.replace('/api', '');
  return result.files.map((file: { url: string }) => {
    // If it's an S3 URL (starts with http), return as-is
    if (file.url.startsWith('http')) {
      return file.url;
    }
    return `${baseUrl}${file.url}`;
  });
}

// Newsletter subscription
export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Visitor Analytics
export interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  uniqueVisitors: number;
}

export async function recordVisit(
  page: string,
  source?: string,
  medium?: string,
  campaign?: string
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/analytics/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page,
        source: source || 'direct',
        medium,
        campaign,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Silently fail - don't break the page if analytics fails
  }
}

export async function getVisitorStats(): Promise<VisitorStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/visitors`);
    if (!response.ok) {
      return { totalVisitors: 0, todayVisitors: 0, uniqueVisitors: 0 };
    }
    return response.json();
  } catch {
    return { totalVisitors: 0, todayVisitors: 0, uniqueVisitors: 0 };
  }
}

export interface TrafficSource {
  source: string;
  count: number;
}

export async function getTrafficSources(): Promise<TrafficSource[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/sources`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

export interface TopPage {
  page: string;
  count: number;
}

export async function getTopPages(): Promise<TopPage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/pages`);
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}
