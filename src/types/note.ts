export interface Note {
  id: number;
  title: string;
  content: string;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
