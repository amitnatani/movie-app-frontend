import "./movies.css";
import React, { useEffect, useState } from "react";

export default function Movies() {
  const [searchInput, setSearchInput] = useState(null);
  const getMoviesUrl = "http://localhost:3001/movies";
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState(null);

  const [movieSelection, setMovieSelection] = useState('all')

  const fetchData = (query) => {
    let url;
    if (query) {
      url = getMoviesUrl + `?query=${query}`
      url += `&mode=${movieSelection}`
    } else {
      url = getMoviesUrl + `?mode=${movieSelection}`
    }
    return fetch(url).then((res) => res.json())
                      .then((data) => setMovies(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchMovies = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value)
    fetchData(e.target.value);
  };

  function markAsFavourite(movieId) {
    fetch(`http://localhost:3001/movies/add_to_favourite`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: movieId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        fetchData();
      });
  }

  function showMovieDetails(movieId) {
    let url = `http://localhost:3001/movies/${movieId}`
    return fetch(url).then((res) => res.json())
                      .then((data) => setMovie(data));
  }

  const onMovieSelectionChange = e => {
    const value = e.target.value;
    setMovieSelection(value);
    const url = getMoviesUrl + `?mode=${value}`
    return fetch(url).then((res) => res.json())
                      .then((data) => setMovies(data));
  }

  return (
    <div>
      <div>
        <input type="radio" name="movieSelection" value="all" id="all" checked={movieSelection === "all"} onChange={onMovieSelectionChange}/>
        <label htmlFor="all">All</label>
        <input type="radio" name="movieSelection" value="favourite" id="favourite" checked={movieSelection === "favourite"} onChange={onMovieSelectionChange}/>
        <label htmlFor="favourite">Favourite</label>
      </div>
      <input type='text' placeholder='Search movies' onChange={searchMovies} value={searchInput} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Favourite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.year}</td>
              <td>{movie.is_favourite ? '✓' : ''}</td>
              {!movie.is_favourite ? <td>
                <button onClick={() => markAsFavourite(movie.id)}>
                  Mark as Favourite
                </button>
              </td> : '' }
              <button onClick={() => showMovieDetails(movie.id)}>Show</button>
            </tr>
          ))}
        </tbody>
      </table>
      { movie ?
      <div>
        <h3>Movie Details</h3>
        <p><b>Title:</b> {movie.title}</p>
        <p><b>Genre:</b> {movie.genre}</p>
        <p><b>Year:</b> {movie.year}</p>
        <p><b>Budget:</b> {movie.budget_in_cr} cr</p>
        <p><b>Earnings:</b> {movie.box_office_earnings_in_cr} cr</p>
      </div> : '' }
    </div>
  );
}
