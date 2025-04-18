const normalizeFaction = (name) => {
    // Remove the 'gw40k-' prefix
    const withoutPrefix = name.replace(/^gw40k-/, '');
    
    // Replace hyphens with spaces and capitalize each word
    const normalized = withoutPrefix
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return normalized;
}

export {normalizeFaction};