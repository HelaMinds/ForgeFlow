const IDEA_TYPES = [
  { id: 'startup', label: 'Startup' },
  { id: 'class_project', label: 'Class project' },
  { id: 'side_hustle', label: 'Side hustle' },
];

const IDEA_TYPE_IDS = IDEA_TYPES.map((type) => type.id);

function getIdeaTypeLabel(id) {
  return IDEA_TYPES.find((type) => type.id === id)?.label || id;
}

module.exports = {
  IDEA_TYPES,
  IDEA_TYPE_IDS,
  getIdeaTypeLabel,
};
