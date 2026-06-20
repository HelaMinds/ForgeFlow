const IDEA_TYPES = [
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

const IDEA_TYPE_IDS = IDEA_TYPES.map((type) => type.id);

function getIdeaTypeLabel(id) {
  return IDEA_TYPES.find((type) => type.id === id)?.label || id;
}

function getIdeaTypeDescription(id) {
  return IDEA_TYPES.find((type) => type.id === id)?.description || '';
}

module.exports = {
  IDEA_TYPES,
  IDEA_TYPE_IDS,
  getIdeaTypeLabel,
  getIdeaTypeDescription,
};
