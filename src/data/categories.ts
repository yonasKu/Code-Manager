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

export const categories: Category[] = [
  {
    title: 'Custom Codes',
    icon: 'code-tags',
    subcategories: []
  },
  {
    title: 'Call Management',
    icon: 'phone',
    subcategories: [
      { 
        title: 'Call Barring', 
        icon: 'phone-lock',
        codes: [
          { code: '*33*pin#', description: 'Activate call barring' },
          { code: '#33*pin#', description: 'Deactivate call barring' },
          { code: '*#33#', description: 'Check call barring status' }
        ]
      },
      { 
        title: 'Call Control (During Call)', 
        icon: 'phone-in-talk',
        codes: [
          { code: '*43#', description: 'Activate call waiting' },
          { code: '#43#', description: 'Deactivate call waiting' }
        ]
      },
      { 
        title: 'Call Forwarding', 
        icon: 'phone-forward',
        codes: [
          { code: '*21*number#', description: 'Forward all calls' },
          { code: '#21#', description: 'Cancel forwarding' },
          { code: '*#21#', description: 'Check forwarding status' }
        ]
      },
      { 
        title: 'Call Waiting', 
        icon: 'phone-paused',
        codes: [
          { code: '*43#', description: 'Activate call waiting' },
          { code: '#43#', description: 'Deactivate call waiting' },
          { code: '*#43#', description: 'Check call waiting status' }
        ]
      },
      { 
        title: 'Caller ID', 
        icon: 'account-box',
        codes: [
          { code: '*31#number', description: 'Hide caller ID for one call' },
          { code: '#31#number', description: 'Show caller ID for one call' }
        ]
      },
      { 
        title: 'Conference Call', 
        icon: 'account-group',
        codes: [
          { code: 'N/A', description: 'Usually handled by phone UI' }
        ]
      }
    ]
  },
  {
    title: 'Carrier Specific',
    icon: 'sim',
    subcategories: [
      { 
        title: 'Account Management', 
        icon: 'account-cog',
        codes: [
          { code: '*225#', description: 'Check account balance (varies by carrier)' },
          { code: '*646#', description: 'Check minutes (varies by carrier)' }
        ]
      },
      { 
        title: 'Services', 
        icon: 'toolbox',
        codes: [
          { code: '*729#', description: 'Data services (varies by carrier)' }
        ]
      },
      { 
        title: 'Voicemail', 
        icon: 'voicemail',
        codes: [
          { code: '*86', description: 'Access voicemail (common in US)' },
          { code: '121', description: 'Access voicemail (common in Europe)' }
        ]
      }
    ]
  },
  {
    title: 'Device Configuration',
    icon: 'cellphone-cog',
    subcategories: [
      { 
        title: 'Codec Settings (Legacy GSM)', 
        icon: 'tune',
        codes: [
          { code: '*#0011#', description: 'GSM codec settings (Samsung)' }
        ]
      },
      { 
        title: 'Network Mode', 
        icon: 'network',
        codes: [
          { code: '*#*#4636#*#*', description: 'Phone info menu (Android)' }
        ]
      },
      { 
        title: 'SIM Lock Status (Legacy)', 
        icon: 'lock',
        codes: [
          { code: '*#7465625#', description: 'Check SIM lock status (Samsung)' }
        ]
      },
      { 
        title: 'Security', 
        icon: 'shield',
        codes: [
          { code: '*#*#7780#*#*', description: 'Factory reset (some Android devices)' }
        ]
      }
    ]
  },
  {
    title: 'Device Diagnostics',
    icon: 'cellphone-check',
    subcategories: [
      { 
        title: 'Diagnostic Menu (Samsung)', 
        icon: 'tools',
        codes: [
          { code: '*#0*#', description: 'Samsung test menu' },
          { code: '*#12580*369#', description: 'Software and hardware info' }
        ]
      },
      { 
        title: 'Field Test Mode', 
        icon: 'signal',
        codes: [
          { code: '*3001#12345#*', description: 'Field test mode (iPhone)' },
          { code: '*#*#4636#*#*', description: 'Testing menu (Android)' }
        ]
      },
      { 
        title: 'Diagnostic Menu (Honor - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (Infinix - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (Lenovo - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (OnePlus - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (Samsung - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (Tecno - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Diagnostic Menu (Vivo - Original User Input)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Engineering/Service Menu', 
        icon: 'wrench',
        codes: []
      },
      { 
        title: 'Hardware Test Menu', 
        icon: 'chip',
        codes: []
      }
    ]
  },
  {
    title: 'Device Information',
    icon: 'information',
    subcategories: [
      { 
        title: 'Device Info / Testing Menu', 
        icon: 'information-outline',
        codes: [
          { code: '*#0*#', description: 'Samsung test menu' }
        ]
      },
      { 
        title: 'IMEI', 
        icon: 'identifier',
        codes: [
          { code: '*#06#', description: 'Show device IMEI' }
        ]
      },
      { 
        title: 'SIM Information', 
        icon: 'sim',
        codes: [
          { code: '*#*#4636#*#*', description: 'Phone information menu (Android)' }
        ]
      },
      { 
        title: 'Firmware Version (Samsung)', 
        icon: 'cellphone-arrow-down',
        codes: []
      },
      { 
        title: 'Hardware Version (Samsung - Legacy)', 
        icon: 'memory',
        codes: []
      },
      { 
        title: 'Own Number', 
        icon: 'phone',
        codes: []
      },
      { 
        title: 'Software Version', 
        icon: 'update',
        codes: []
      }
    ]
  },
  {
    title: 'Device Reset',
    icon: 'restore',
    subcategories: [
      { 
        title: 'Factory Reset', 
        icon: 'factory',
        codes: [
          { code: '*#*#7780#*#*', description: 'Factory data reset (some Android devices)' },
          { code: '*2767*3855#', description: 'Full factory reset (Samsung - use with caution)' }
        ]
      }
    ]
  },
  {
    title: 'Device Specific',
    icon: 'cellphone-settings',
    subcategories: [
      { 
        title: 'Battery Information', 
        icon: 'battery',
        codes: [
          { code: '*#*#4636#*#*', description: 'Phone information including battery (Android)' }
        ]
      },
      { 
        title: 'IMEI', 
        icon: 'identifier',
        codes: [
          { code: '*#06#', description: 'Show device IMEI' }
        ]
      },
      { 
        title: 'Field Test Mode', 
        icon: 'signal',
        codes: []
      },
      { 
        title: 'Huawei', 
        icon: 'cellphone',
        codes: []
      },
      { 
        title: 'iPhone', 
        icon: 'apple',
        codes: []
      },
      { 
        title: 'Samsung', 
        icon: 'cellphone',
        codes: []
      },
      { 
        title: 'Service Menu (CIT)', 
        icon: 'tools',
        codes: []
      },
      { 
        title: 'Service Menu (General Test)', 
        icon: 'wrench',
        codes: []
      },
      { 
        title: 'Xiaomi', 
        icon: 'cellphone',
        codes: []
      }
    ]
  },
  {
    title: 'Regional Specific',
    icon: 'map-marker',
    subcategories: [
      { 
        title: 'Emergency Services', 
        icon: 'ambulance',
        codes: [
          { code: '911', description: 'Emergency services (US)' },
          { code: '112', description: 'Emergency services (EU)' },
          { code: '999', description: 'Emergency services (UK)' }
        ]
      }
    ]
  }
];

export const getCategoryByTitle = (title: string): Category | undefined => {
  return categories.find(category => category.title === title);
};

export const getSubcategoriesByCategory = (categoryTitle: string): Subcategory[] => {
  const category = getCategoryByTitle(categoryTitle);
  return category ? category.subcategories : [];
};

export const getCodesByCategory = (categoryTitle: string): UssdCode[] => {
  const category = getCategoryByTitle(categoryTitle);
  return category?.codes || [];
};

export const getCodesBySubcategory = (categoryTitle: string, subcategoryTitle: string): UssdCode[] => {
  const category = getCategoryByTitle(categoryTitle);
  if (!category) return [];
  
  const subcategory = category.subcategories.find(sub => sub.title === subcategoryTitle);
  return subcategory?.codes || [];
};
