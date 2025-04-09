import { UssdCode, CategoryData } from '../types/ussdCodes';
import ussdCodesData from '../data/ussd_codes.json';

// Type assertion for the imported JSON data
const ussdCodes = ussdCodesData as UssdCode[];

/**
 * Get all USSD codes
 */
export const getAllUssdCodes = (): UssdCode[] => {
  return ussdCodes;
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): string[] => {
  return [...new Set(ussdCodes.map(code => code.category))];
};

/**
 * Get all subcategories for a specific category
 */
export const getSubcategoriesByCategory = (category: string): string[] => {
  const subcategories = ussdCodes
    .filter(code => code.category === category)
    .map(code => code.subcategory);
  
  return [...new Set(subcategories)];
};

/**
 * Get all codes by category and subcategory
 */
export const getCodesByCategoryAndSubcategory = (
  category: string,
  subcategory: string
): UssdCode[] => {
  return ussdCodes.filter(
    code => code.category === category && code.subcategory === subcategory
  );
};

/**
 * Get all codes by category
 */
export const getCodesByCategory = (category: string): UssdCode[] => {
  return ussdCodes.filter(code => code.category === category);
};

/**
 * Get a code by ID
 */
export const getCodeById = (id: number): UssdCode | undefined => {
  return ussdCodes.find(code => code.id === id);
};

/**
 * Organize all codes by category and subcategory
 */
export const organizeCodesByCategoryAndSubcategory = (): CategoryData => {
  const organizedData: CategoryData = {};

  ussdCodes.forEach(code => {
    if (!organizedData[code.category]) {
      organizedData[code.category] = {};
    }
    
    if (!organizedData[code.category][code.subcategory]) {
      organizedData[code.category][code.subcategory] = [];
    }
    
    organizedData[code.category][code.subcategory].push(code);
  });

  return organizedData;
};

/**
 * Search codes by query string (searches in function, description, code, and tags)
 */
export const searchCodes = (query: string): UssdCode[] => {
  const lowerCaseQuery = query.toLowerCase();
  
  return ussdCodes.filter(code => 
    code.function.toLowerCase().includes(lowerCaseQuery) ||
    code.actions.some(action => 
      action.description.toLowerCase().includes(lowerCaseQuery) ||
      action.code.toLowerCase().includes(lowerCaseQuery)
    ) ||
    code.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};

/**
 * Find related codes for a specific code
 * Related codes are defined as:
 * 1. Other actions in the same function (e.g., activate, cancel, check)
 * 2. Codes in the same subcategory
 */
export const findRelatedCodes = (codeString: string): { code: string; description: string }[] => {
  // Find the code object that contains this code string
  const codeObject = ussdCodes.find(code => 
    code.actions.some(action => action.code === codeString)
  );
  
  if (!codeObject) {
    return [];
  }
  
  // Get the action that matches the code string
  const currentAction = codeObject.actions.find(action => action.code === codeString);
  
  // First, get other actions from the same function (highest priority)
  const relatedActions = codeObject.actions
    .filter(action => action.code !== codeString)
    .map(action => ({
      code: action.code,
      description: action.description
    }));
  
  // If we don't have enough related actions, add codes from the same subcategory
  if (relatedActions.length < 3) {
    const subcategoryRelatedCodes = ussdCodes
      .filter(code => 
        code.id !== codeObject.id && 
        code.category === codeObject.category && 
        code.subcategory === codeObject.subcategory
      )
      .flatMap(code => 
        code.actions.map(action => ({
          code: action.code,
          description: action.description
        }))
      )
      // Limit to avoid too many related codes
      .slice(0, 5 - relatedActions.length);
    
    return [...relatedActions, ...subcategoryRelatedCodes];
  }
  
  return relatedActions;
};

/**
 * Get code details by code string
 */
export const getCodeDetailsByCodeString = (codeString: string): {
  category: string;
  subcategory: string;
  function: string;
  description: string;
  type: string;
  parameters: { name: string; type: string }[];
  notes: string[];
} | null => {
  // Find the code object that contains this code string
  const codeObject = ussdCodes.find(code => 
    code.actions.some(action => action.code === codeString)
  );
  
  if (!codeObject) {
    return null;
  }
  
  // Get the action that matches the code string
  const action = codeObject.actions.find(action => action.code === codeString);
  
  if (!action) {
    return null;
  }
  
  return {
    category: codeObject.category,
    subcategory: codeObject.subcategory,
    function: codeObject.function,
    description: action.description,
    type: codeObject.scope,
    parameters: codeObject.input_params.map(param => ({
      name: param.name,
      type: param.type
    })),
    notes: codeObject.notes ? [codeObject.notes] : []
  };
};
