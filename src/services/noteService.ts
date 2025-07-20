import axios from "axios";
import type { Note, FetchNotesResponse } from "../types/note";
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
};

export const fetchNotes = async (
  page: number,
  search: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };

  if (search.trim() !== "") {
    params.search = search.trim();
  }

  const { data } = await axios.get<FetchNotesResponse>(BASE_URL, {
    params,
    headers,
  });

  return data;
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const { data } = await axios.post<Note>(BASE_URL, note, { headers });
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${BASE_URL}/${id}`, { headers });
  return data;
};
