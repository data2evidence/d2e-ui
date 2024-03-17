export const isValidRedirectUrl = (url: string) => {
  // Add aditional redirect urls here to be checked
  const dashboardUrlRegex = /\/dashboard\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
  if (dashboardUrlRegex.test(url)) return true;
};
