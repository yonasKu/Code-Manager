import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

// Define types for carrier data
export type CarrierCode = {
  code: string;
  description: string;
  notes?: string;
};

export type Carrier = {
  name: string;
  type: string;
  ussd_codes: CarrierCode[];
  notes?: string;
};

export type Country = {
  country: string;
  iso: string;
  carriers: Carrier[];
  notes?: string;
};

export type Region = {
  region: string;
  countries: Country[];
};

// Sample data structure to use as fallback
const sampleData: Region[] = [
  {
    region: 'Africa',
    countries: [
      {
        country: 'South Africa',
        iso: 'ZA',
        carriers: [
          {
            name: 'Vodacom',
            type: 'MNO',
            ussd_codes: [
              {
                code: '*100#',
                description: 'Check Balance'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    region: 'Asia',
    countries: [
      {
        country: 'India',
        iso: 'IN',
        carriers: [
          {
            name: 'Jio',
            type: 'MNO',
            ussd_codes: [
              {
                code: '*333#',
                description: 'Check Balance'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    region: 'Europe',
    countries: [
      {
        country: 'United Kingdom',
        iso: 'GB',
        carriers: [
          {
            name: 'Vodafone UK',
            type: 'MNO',
            ussd_codes: [
              {
                code: '*100#',
                description: 'Check Balance'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    region: 'North America',
    countries: [
      {
        country: 'United States',
        iso: 'US',
        carriers: [
          {
            name: 'Verizon',
            type: 'MNO',
            ussd_codes: [
              {
                code: '#BAL',
                description: 'Check Balance'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    region: 'South America & Caribbean',
    countries: [
      {
        country: 'Brazil',
        iso: 'BR',
        carriers: [
          {
            name: 'Vivo',
            type: 'MNO',
            ussd_codes: [
              {
                code: '*8000',
                description: 'Customer Service'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    region: 'Oceania & Pacific',
    countries: [
      {
        country: 'Australia',
        iso: 'AU',
        carriers: [
          {
            name: 'Telstra',
            type: 'MNO',
            ussd_codes: [
              {
                code: '#125#',
                description: 'Check Balance'
              }
            ]
          }
        ]
      }
    ]
  }
];

// Function to get carrier data
export const getCarrierData = async (): Promise<Region[]> => {
  try {
    let jsonData: Region[] = [];
    
    // Path to the sample.json file in the assets directory
    const filePath = Platform.OS === 'android' 
      ? 'asset:/carriers/sample.json' 
      : `${RNFS.MainBundlePath}/carriers/sample.json`;
    
    try {
      // Check if the file exists
      const exists = Platform.OS === 'android' ? true : await RNFS.exists(filePath);
      
      if (exists) {
        // Read the file content
        const content = await RNFS.readFile(filePath, 'utf8');
        
        // Parse the JSON content
        jsonData = JSON.parse(content);
        console.log('Successfully loaded carrier data from assets');
      } else {
        console.warn('Carrier data file not found, using sample data');
        jsonData = sampleData;
      }
    } catch (error) {
      console.error('Error reading carrier data file:', error);
      jsonData = sampleData;
    }
    
    return jsonData;
  } catch (error) {
    console.error('Error getting carrier data:', error);
    return sampleData;
  }
};
