const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function submitIdea(idea) {
  const response = await fetch(`${API_URL}/api/idea`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate plan');
  }

  return data;
}
