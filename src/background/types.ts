export type TermDictionary = Record<string, string>;

export interface MessageResponse {
  result: boolean;
  description?: string;
  count?: number;
  error?: string;
  terms?: TermDictionary;
}

export interface MessageRequest {
  action: string;
  searchTerm?: string;
  additionalTerms?: TermDictionary;
}
