export const IDEA_TYPES = [
  {
    id: 'startup',
    label: 'Startup',
    description: 'Build and launch a product or company with real market goals.',
  },
  {
    id: 'class_project',
    label: 'Class project',
    description: 'Scoped for coursework — deadlines, rubrics, and demo-ready deliverables.',
  },
  {
    id: 'side_hustle',
    label: 'Side hustle',
    description: 'Part-time effort alongside other work — lean scope and low burn.',
  },
];

export function getIdeaTypeLabel(id) {
  return IDEA_TYPES.find((type) => type.id === id)?.label || id;
}

export function getIdeaTypeDescription(id) {
  return IDEA_TYPES.find((type) => type.id === id)?.description || '';
}

async function request(path, options) {
  let response;

  try {
    response = await fetch(path, options);
  } catch {
    throw new Error(
      'Could not reach the backend. Start it with npm run dev:backend and check BACKEND_URL in frontend/.env.local.',
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server error (${response.status}). Check the backend is running and try again.`);
  }

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function clarifyIdea({ idea, ideaType }) {
  return request('/api/idea/clarify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea, ideaType }),
  });
}

export async function generatePlan({ idea, answers, clarified, assessment }) {
  return request('/api/idea/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idea, answers, clarified, assessment }),
  });
}

export async function chatWithPlan({ message, context, history }) {
  return request('/api/idea/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, context, history }),
  });
}

export async function applyPathChoice({ context, selectedPath }) {
  return request('/api/idea/apply-path', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ context, selectedPath }),
  });
}
