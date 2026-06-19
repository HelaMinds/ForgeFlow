async function request(path, options) {
  let response;

  try {
    response = await fetch(path, options);
  } catch {
    throw new Error(
      'Could not reach the backend. Start it with npm run dev:backend and check BACKEND_URL in frontend/.env.local.',
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function clarifyIdea(idea) {
  return request('/api/idea/clarify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea }),
  });
}

export async function generatePlan({ idea, answers, clarified }) {
  return request('/api/idea/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea, answers, clarified }),
  });
}
