export interface InputParam {
  name: string;
  type: string;
  description: string;
  options?: number[] | string[];
}

export interface Action {
  action: string;
  code: string;
  description: string;
}

export interface UssdCode {
  id: number;
  category: string;
  subcategory: string;
  function: string;
  actions: Action[];
  scope: string;
  scope_details: string[];
  verified: boolean;
  risk_level: string;
  input_params: InputParam[];
  tags: string[];
  notes: string;
}

export interface CategoryData {
  [category: string]: {
    [subcategory: string]: UssdCode[];
  };
}
