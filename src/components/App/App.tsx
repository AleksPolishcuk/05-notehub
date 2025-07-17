import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies, type MoviesResponse } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const hasSearchQuery = query !== "";

  const { data, isPending, isError } = useQuery<MoviesResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,

    placeholderData: (previousData) =>
      previousData ?? {
        results: [],
        total_pages: 0,
      },
  });

  useEffect(() => {
    if (hasSearchQuery && data && data.results.length === 0) {
      toast("No movies found. Try a different query.");
    }
  }, [data, hasSearchQuery]);

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(value);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {hasSearchQuery && isPending && <Loader />}
      {hasSearchQuery && isError && <ErrorMessage />}

      {data && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}
