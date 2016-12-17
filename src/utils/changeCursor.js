export const [hoverBody, unHoverBody] = [() => {
  document.body.className = 'isHovered';
}, () => {
  document.body.className = '';
}];