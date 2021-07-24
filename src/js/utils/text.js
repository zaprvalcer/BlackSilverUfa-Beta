export const interpolate = (input, params) => input.replace(/\{\{\w+\}\}/g, (placeholder) => {
  const key = placeholder.replaceAll(/\{\{(\w+)\}\}/g, '$1');
  return (params[key] || placeholder);
});

export const getPluralLabel = (count, labels) => {
  const key = count >= 20 ? count % 10 : count;
  const label = labels[key] || labels[labels.length - 1];
  return `${count} ${label}`;
};
