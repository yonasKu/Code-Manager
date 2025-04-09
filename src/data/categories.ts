export interface Subcategory {
  title: string;
  icon?: string;
  codes?: UssdCode[];
}

export interface UssdCode {
  code: string;
  description: string;
  type?: string;
}

export interface Category {
  title: string;
  icon: string;
  subcategories: Subcategory[];
  codes?: UssdCode[]; // Direct codes for the category
}

import ussdCodesJson from './ussd_codes.json';

const processJsonData = () => {
  const ussdCodes = ussdCodesJson as any[];
  
  const categoriesMap = new Map<string, Map<string, any[]>>();
  
  ussdCodes.forEach(code => {
    if (!categoriesMap.has(code.category)) {
      categoriesMap.set(code.category, new Map<string, any[]>());
    }
    
    const subcategoriesMap = categoriesMap.get(code.category)!;
    if (!subcategoriesMap.has(code.subcategory)) {
      subcategoriesMap.set(code.subcategory, []);
    }
    
    subcategoriesMap.get(code.subcategory)!.push(code);
  });
  
  const processedCategories: Category[] = [];
  
  categoriesMap.forEach((subcategoriesMap, categoryName) => {
    const subcategories: Subcategory[] = [];
    
    subcategoriesMap.forEach((codes, subcategoryName) => {
      const uiCodes = codes.flatMap(code => 
        code.actions.map((action: any) => ({
          code: action.code,
          description: action.description
        }))
      );
      
      subcategories.push({
        title: subcategoryName,
        icon: getIconForSubcategory(subcategoryName),
        codes: uiCodes
      });
    });
    
    processedCategories.push({
      title: categoryName,
      icon: getIconForCategory(categoryName),
      subcategories
    });
  });
  
  return processedCategories;
};

const getIconForCategory = (category: string): string => {
  switch (category) {
    case 'Call Management':
      return 'phone';
    case 'Device Information':
      return 'cellphone-information';
    case 'Device Diagnostics':
      return 'wrench';
    case 'Device Configuration':
      return 'cog';
    case 'Carrier Specific':
      return 'sim';
    case 'Regional Specific':
      return 'map-marker';
    case 'Device Specific':
      return 'cellphone';
    case 'Custom Codes':
      return 'code-tags';
    default:
      return 'folder-multiple';
  }
};

const getIconForSubcategory = (subcategory: string): string => {
  // First check for exact matches
  switch (subcategory) {
    case 'Call Forwarding':
      return 'phone-forward';
    case 'Call Barring':
      return 'phone-lock';
    case 'Call Waiting':
      return 'phone-in-talk';
    case 'Caller ID':
      return 'account-box';
    case 'Hardware Version':
      return 'memory';
    case 'Software Version':
      return 'update';
    case 'IMEI':
      return 'cellphone-key';
    case 'Security':
      return 'shield';
    case 'Diagnostic Menu':
      return 'tools';
    case 'Emergency Services':
      return 'ambulance';
    case 'Balance':
      return 'cash';
    case 'Data':
      return 'wifi';
    case 'Voice':
      return 'phone';
    case 'SMS':
      return 'message-text';
    case 'Packages':
      return 'package-variant-closed';
    case 'Promotions':
      return 'tag';
    case 'Roaming':
      return 'earth';
    case 'Customer Service':
      return 'headset';
    case 'Settings':
      return 'cog';
    case 'Custom Codes':
      return 'code-tags';
    case 'My Codes':
      return 'code-braces';
    case 'User Created':
      return 'account-edit';
  }
  
  // If no exact match, check for keywords in the subcategory name
  const subcategoryLower = subcategory.toLowerCase();
  
  if (subcategoryLower.includes('call') || subcategoryLower.includes('phone')) {
    return 'phone';
  }
  if (subcategoryLower.includes('data') || subcategoryLower.includes('internet') || subcategoryLower.includes('mb')) {
    return 'wifi';
  }
  if (subcategoryLower.includes('balance') || subcategoryLower.includes('credit') || subcategoryLower.includes('payment')) {
    return 'cash';
  }
  if (subcategoryLower.includes('sms') || subcategoryLower.includes('message')) {
    return 'message-text';
  }
  if (subcategoryLower.includes('bundle') || subcategoryLower.includes('package')) {
    return 'package-variant-closed';
  }
  if (subcategoryLower.includes('service') || subcategoryLower.includes('support') || subcategoryLower.includes('help')) {
    return 'headset';
  }
  if (subcategoryLower.includes('setting') || subcategoryLower.includes('config')) {
    return 'cog';
  }
  if (subcategoryLower.includes('custom') || subcategoryLower.includes('user') || subcategoryLower.includes('my')) {
    return 'code-tags';
  }
  if (subcategoryLower.includes('promo') || subcategoryLower.includes('offer')) {
    return 'tag';
  }
  if (subcategoryLower.includes('roam') || subcategoryLower.includes('international')) {
    return 'earth';
  }
  if (subcategoryLower.includes('emergency') || subcategoryLower.includes('sos')) {
    return 'ambulance';
  }
  if (subcategoryLower.includes('security') || subcategoryLower.includes('protect')) {
    return 'shield';
  }
  
  // Default icon based on category if possible
  return 'apps';
};

const jsonCategories = processJsonData();

const customCodesCategory: Category = {
  title: 'Custom Codes',
  icon: 'code-tags',
  subcategories: []
};

export const categories: Category[] = [
  customCodesCategory,
  ...jsonCategories
];

export function getCategoryByTitle(title: string): Category | undefined {
  return categories.find(category => category.title === title);
}

export function getSubcategoriesByCategory(categoryTitle: string): Subcategory[] {
  const category = getCategoryByTitle(categoryTitle);
  return category ? category.subcategories : [];
}

export function getCodesByCategory(categoryTitle: string): UssdCode[] {
  const category = getCategoryByTitle(categoryTitle);
  return category?.codes || [];
}

export function getCodesBySubcategory(
  categoryTitle: string,
  subcategoryTitle: string,
): UssdCode[] {
  const subcategories = getSubcategoriesByCategory(categoryTitle);
  const subcategory = subcategories.find(sub => sub.title === subcategoryTitle);
  return subcategory?.codes || [];
}
