import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required("Required"),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Required"),
});

const NoteForm: React.FC<NoteFormProps> = ({ onCancel }) => {
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tag: "Todo" as NoteTag,
    },
    validationSchema,
    onSubmit: async (values) => {
      await createNote(values);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.errors.title && (
          <span className={css.error}>{formik.errors.title}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          value={formik.values.content}
        />
        {formik.errors.content && (
          <span className={css.error}>{formik.errors.content}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.errors.tag && (
          <span className={css.error}>{formik.errors.tag}</span>
        )}
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
};
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
export default NoteForm;
