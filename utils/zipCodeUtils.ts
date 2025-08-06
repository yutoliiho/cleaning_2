// Zip code validation utility
export const isValidZipCode = (zipCode: string): boolean => {
  // Check if it's exactly 5 digits
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
};

// Address validation utility
export const isValidAddress = (address: string): boolean => {
  // Check if address has minimum required components
  if (!address || address.trim().length < 10) {
    return false;
  }
  
  // Should contain at least a number and street name
  const addressRegex = /\d+.*[a-zA-Z]+.*[a-zA-Z]+/;
  return addressRegex.test(address.trim());
};

// Phone number validation utility
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if it's 10 digits (US phone number)
  return digitsOnly.length === 10;
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber: string): string => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  if (digitsOnly.length === 0) return '';
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

// Mock neighborhood lookup data (in a real app, this would be an API call)
const zipCodeNeighborhoods: Record<string, string> = {
  '94133': 'Russian Hill, San Francisco, CA',
  '94102': 'Tenderloin, San Francisco, CA',
  '94103': 'SOMA, San Francisco, CA',
  '94104': 'Financial District, San Francisco, CA',
  '94105': 'SOMA, San Francisco, CA',
  '94107': 'SOMA, San Francisco, CA',
  '94108': 'Chinatown, San Francisco, CA',
  '94109': 'Nob Hill, San Francisco, CA',
  '94110': 'Mission District, San Francisco, CA',
  '94111': 'Financial District, San Francisco, CA',
  '94112': 'Outer Mission, San Francisco, CA',
  '94114': 'Castro, San Francisco, CA',
  '94115': 'Pacific Heights, San Francisco, CA',
  '94116': 'Sunset District, San Francisco, CA',
  '94117': 'Haight-Ashbury, San Francisco, CA',
  '94118': 'Richmond District, San Francisco, CA',
  '94121': 'Richmond District, San Francisco, CA',
  '94122': 'Sunset District, San Francisco, CA',
  '94123': 'Marina District, San Francisco, CA',
  '94124': 'Bayview, San Francisco, CA',
  '94127': 'West Portal, San Francisco, CA',
  '94131': 'Glen Park, San Francisco, CA',
  '94132': 'Lakeside, San Francisco, CA',
  '94134': 'Visitacion Valley, San Francisco, CA',
  '10001': 'Chelsea, New York, NY',
  '10002': 'Lower East Side, New York, NY',
  '10003': 'East Village, New York, NY',
  '10004': 'Financial District, New York, NY',
  '10005': 'Financial District, New York, NY',
  '10006': 'Financial District, New York, NY',
  '10007': 'Financial District, New York, NY',
  '10009': 'East Village, New York, NY',
  '10010': 'Flatiron District, New York, NY',
  '10011': 'Chelsea, New York, NY',
  '10012': 'SoHo, New York, NY',
  '10013': 'SoHo, New York, NY',
  '10014': 'West Village, New York, NY',
  '10016': 'Murray Hill, New York, NY',
  '10017': 'Midtown East, New York, NY',
  '10018': 'Midtown West, New York, NY',
  '10019': 'Midtown West, New York, NY',
  '10021': 'Upper East Side, New York, NY',
  '10022': 'Midtown East, New York, NY',
  '10023': 'Upper West Side, New York, NY',
  '10024': 'Upper West Side, New York, NY',
  '10025': 'Upper West Side, New York, NY',
  '10028': 'Upper East Side, New York, NY',
  '90210': 'Beverly Hills, CA',
  '90211': 'Beverly Hills, CA',
  '90212': 'Beverly Hills, CA',
  '90401': 'Santa Monica, CA',
  '90402': 'Santa Monica, CA',
  '90403': 'Santa Monica, CA',
  '90404': 'Santa Monica, CA',
  '90405': 'Santa Monica, CA',
  '02101': 'Downtown, Boston, MA',
  '02102': 'Financial District, Boston, MA',
  '02108': 'Beacon Hill, Boston, MA',
  '02109': 'North End, Boston, MA',
  '02110': 'Financial District, Boston, MA',
  '02111': 'Chinatown, Boston, MA',
  '02113': 'North End, Boston, MA',
  '02114': 'West End, Boston, MA',
  '02115': 'Back Bay, Boston, MA',
  '02116': 'Back Bay, Boston, MA',
  '02118': 'South End, Boston, MA',
  '02119': 'Roxbury, Boston, MA',
  '02120': 'Mission Hill, Boston, MA',
  '02121': 'Dorchester, Boston, MA',
  '02122': 'Dorchester, Boston, MA',
  '02124': 'Dorchester, Boston, MA',
  '02125': 'Dorchester, Boston, MA',
  '02126': 'Mattapan, Boston, MA',
  '02127': 'South Boston, Boston, MA',
  '02128': 'East Boston, Boston, MA',
  '02129': 'Charlestown, Boston, MA',
  '02130': 'Jamaica Plain, Boston, MA',
  '02131': 'Roslindale, Boston, MA',
  '02132': 'West Roxbury, Boston, MA',
  '02134': 'Allston, Boston, MA',
  '02135': 'Brighton, Boston, MA',
  '02136': 'Hyde Park, Boston, MA',
  '02138': 'Cambridge, MA',
  '02139': 'Cambridge, MA',
  '02140': 'Cambridge, MA',
  '02141': 'Cambridge, MA',
  '02142': 'Cambridge, MA',
  '02143': 'Somerville, MA',
  '02144': 'Somerville, MA',
  '02145': 'Somerville, MA',
};

// Function to get neighborhood from zip code
export const getNeighborhoodFromZipCode = (zipCode: string): string | null => {
  if (!isValidZipCode(zipCode)) {
    return null;
  }
  
  return zipCodeNeighborhoods[zipCode] || null;
};

// Function to simulate API call for neighborhood lookup (for future enhancement)
export const lookupNeighborhood = async (zipCode: string): Promise<string | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would make an API call to a service like:
  // - Google Maps Geocoding API
  // - USPS API
  // - Zippopotam.us API
  // - Custom zip code database
  
  return getNeighborhoodFromZipCode(zipCode);
}; 