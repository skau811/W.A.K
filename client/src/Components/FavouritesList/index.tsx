import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import axios from "axios";
import { apiKey } from "../../../env.js";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";
import "./style.css";

interface FavouriteMovie {
    movieId: string;
    movieTitle: string;
    addedAt: Date;
    rating: number;
}

interface FavouritesListProps {
    onFirstMovieChange: (movie: any) => void;
}

const FavouritesList: React.FC<FavouritesListProps> = ({
    onFirstMovieChange,
}) => {
    const { user } = useAuthContext();

    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [moviesData, setMoviesData] = useState<any[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("added");

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${
                        user.username
                    }/favorites?sortBy=${sortOrder}`
                );

                const movieDetailsPromises = response.data.map(
                    async (favorite: FavouriteMovie) => {
                        const movieDetailRes = await fetch(
                            `https://api.themoviedb.org/3/movie/${favorite.movieId}?api_key=${apiKey}&language=en-US`
                        );
                        const movieDetail = await movieDetailRes.json();

                        // Return a combined object with movie details and rating
                        return {
                            ...movieDetail,
                            rating: favorite.rating,
                        };
                    }
                );

                const movieDetailsWithRating = await Promise.all(
                    movieDetailsPromises
                );

                if (movieDetailsWithRating.length > 0) {
                    onFirstMovieChange(movieDetailsWithRating[0]);
                }

                setMoviesData(movieDetailsWithRating);
                setIsPending(false);
            } catch (err: any) {
                setIsPending(false);
                setError(err.message);
            }
        };

        fetchFavourites();
    }, [sortOrder]);

    const handleMovieDeleted = (deletedMovieId: number) => {
        const wasFirstMovie =
            moviesData[0] && moviesData[0].id === deletedMovieId;

        const updatedMoviesData = moviesData.filter(
            (movie) => movie.id !== deletedMovieId
        );
        setMoviesData(updatedMoviesData);

        if (wasFirstMovie) {
            if (updatedMoviesData.length > 0) {
                onFirstMovieChange(updatedMoviesData[0]);
            } else {
                // Reset to default theme if no movies are left.
                onFirstMovieChange(null);
            }
        }
    };

    return (
        <div className="favourites-page">
            {moviesData.length > 0 && (
                <div className="dropdown-container">
                    <label htmlFor="sortOrder" className="dropdown-label">
                        Sort by:{" "}
                    </label>
                    <select
                        className="dropdown-select"
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="added">Added Date</option>
                        <option value="rating">Top rated by you</option>
                    </select>
                </div>
            )}

            <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {!isPending && moviesData.length === 0 && (
                    <div>
                        Your favorites list is empty. Start exploring and add
                        movies you love!
                    </div>
                )}
                {moviesData &&
                    moviesData.map((movie, index) => (
                        <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            key={index}
                            className="grid-item"
                        >
                            <MovieCard movie={movie} />
                            <div className="rating-div">
                                {" "}
                                {movie.rating > 0
                                    ? `Your rating : ${movie.rating}/5`
                                    : "Not rated yet"}
                            </div>

                            <DeleteButton
                                className="delete-btn-div"
                                movieId={movie.id}
                                onMovieDeleted={handleMovieDeleted}
                            />
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
};

export default FavouritesList;
