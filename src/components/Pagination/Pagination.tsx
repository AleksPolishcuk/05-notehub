import React from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  search: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  search,
}) => {
  const { data } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    staleTime: 5000,
  });

  if (!data || data.totalPages <= 1) return null;

  return (
    <ReactPaginate
      className={css.pagination}
      activeClassName={css.active}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={(event) => onPageChange(event.selected + 1)}
      pageCount={data.totalPages}
      forcePage={currentPage - 1}
    />
  );
};

export default Pagination;
