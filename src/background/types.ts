export interface MessageResponse {
  result: boolean;
  description?: string;
  count?: number;
  error?: string;
  terms?: Record<string, string>;
}

export interface MessageRequest {
  action: string;
  searchTerm?: string;
  additionalTerms?: Record<string, string>;
}
