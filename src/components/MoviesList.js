import React from 'react';

import Movie from './Movie';
import classes from './MoviesList.module.css';

const MovieList = (props) => {
  const handleDeleteMovie = (id) => {
    // Pass the movie id to the delete handler function from props
    if (props.onDeleteMovie) {
      props.onDeleteMovie(id);
    }
  };
  return (
    <ul className={classes['movies-list']}>
      {props.movies.map((movie) => (
        <li key={movie.id}>
        <Movie
          key={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          openingText={movie.openingText}
        />
        {/* Delete button for each movie item */}
        <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default MovieList;
