import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  page: number;
  search: string;
}

const NoteList: React.FC<NoteListProps> = ({ page, search }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
    staleTime: 5000,
  });

  const handleDelete = async (id: number) => {
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };
  console.log("NoteList data:", data);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;
  if (!data || !Array.isArray(data.notes) || data.notes.length === 0)
    return <p>No notes found.</p>;

  return (
    <ul className={css.list}>
      {data.notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag || "No tag"}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
