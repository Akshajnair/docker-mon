export function removeTrailingSlask(url: string): string {
  if (!url) return '';
  return url.replace(/\/$/, '');
}

export function toPascalCase(text: string): string {
  return text
    .replace(/[_\s-]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function capitalizeAfterSpace(input: string): string {
    return input.replace(/\b\w/g, (match) => match.toUpperCase());
  }