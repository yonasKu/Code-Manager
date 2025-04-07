export interface Subcategory {
  title: string;
  icon?: string;
}

export interface Category {
  title: string;
  icon: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    title: 'Call Management',
    icon: 'phone',
    subcategories: [
      { title: 'Call Barring', icon: 'phone-lock' },
      { title: 'Call Control (During Call)', icon: 'phone-in-talk' },
      { title: 'Call Forwarding', icon: 'phone-forward' },
      { title: 'Call Waiting', icon: 'phone-paused' },
      { title: 'Caller ID', icon: 'account-box' },
      { title: 'Conference Call', icon: 'account-group' }
    ]
  },
  {
    title: 'Carrier Specific',
    icon: 'sim',
    subcategories: [
      { title: 'Account Management', icon: 'account-cog' },
      { title: 'Services', icon: 'toolbox' },
      { title: 'Voicemail', icon: 'voicemail' }
    ]
  },
  {
    title: 'Device Configuration',
    icon: 'cellphone-cog',
    subcategories: [
      { title: 'Codec Settings (Legacy GSM)', icon: 'tune' },
      { title: 'Network Mode', icon: 'network' },
      { title: 'SIM Lock Status (Legacy)', icon: 'lock' },
      { title: 'Security', icon: 'shield' }
    ]
  },
  {
    title: 'Device Diagnostics',
    icon: 'cellphone-check',
    subcategories: [
      { title: 'Diagnostic Menu (Honor - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (Infinix - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (Lenovo - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (OnePlus - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (Samsung)', icon: 'tools' },
      { title: 'Diagnostic Menu (Samsung - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (Tecno - Original User Input)', icon: 'tools' },
      { title: 'Diagnostic Menu (Vivo - Original User Input)', icon: 'tools' },
      { title: 'Engineering/Service Menu', icon: 'wrench' },
      { title: 'Field Test Mode', icon: 'signal' },
      { title: 'Hardware Test Menu', icon: 'chip' }
    ]
  },
  {
    title: 'Device Information',
    icon: 'information',
    subcategories: [
      { title: 'Device Info / Testing Menu', icon: 'information-outline' },
      { title: 'Firmware Version (Samsung)', icon: 'cellphone-arrow-down' },
      { title: 'Hardware Version (Samsung - Legacy)', icon: 'memory' },
      { title: 'IMEI', icon: 'identifier' },
      { title: 'Own Number', icon: 'phone' },
      { title: 'SIM Information', icon: 'sim' },
      { title: 'Software Version', icon: 'update' }
    ]
  },
  {
    title: 'Device Reset',
    icon: 'restore',
    subcategories: [
      { title: 'Factory Reset', icon: 'factory' }
    ]
  },
  {
    title: 'Device Specific',
    icon: 'cellphone-settings',
    subcategories: [
      { title: 'Battery Information', icon: 'battery' },
      { title: 'Field Test Mode', icon: 'signal' },
      { title: 'Huawei', icon: 'cellphone' },
      { title: 'IMEI', icon: 'identifier' },
      { title: 'iPhone', icon: 'apple' },
      { title: 'Samsung', icon: 'cellphone' },
      { title: 'Service Menu (CIT)', icon: 'tools' },
      { title: 'Service Menu (General Test)', icon: 'wrench' },
      { title: 'Xiaomi', icon: 'cellphone' }
    ]
  },
  {
    title: 'Regional Specific',
    icon: 'map-marker',
    subcategories: [
      { title: 'Emergency Services', icon: 'ambulance' }
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
