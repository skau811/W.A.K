import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext";
import axios from "axios";
import { apiKey } from "../../../env.js";
import MovieCard from "../MovieCard";
import { Grid } from "@mui/material";
import DeleteButton from "../DeleteFavoriteButton";

interface FavouriteMovie {
    movieId: string;
    movieTitle: string;
    addedAt: Date;
    rating?: number;
}

const FavouritesList: React.FC = () => {
    const { user } = useAuthContext();

    const [isPending, setIsPending] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [moviesData, setMoviesData] = useState<Movie[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("added"); // Default sorting order

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_API_URL}/${
                        user.username
                    }/favorites?sortBy=${sortOrder}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                // Extract movieIds from the response data
                const movieIds = response.data.map((fav: any) => fav.movieId);
                console.log("Sample favorite:", response.data[0]);

                //console.log(movieIds);

                // Fetch details for each favorite movie using movieIds
                const movieDetailsPromises = response.data.map(
                    (favorite: FavouriteMovie) =>
                        fetch(
                            `https://api.themoviedb.org/3/movie/${favorite.movieId}?api_key=${apiKey}&language=en-US`
                        ).then((response) => response.json())
                );

                const movieDetails = await Promise.all(movieDetailsPromises);
                setMoviesData(movieDetails);
                setIsPending(false);
            } catch (err: any) {
                setIsPending(false);
                setError(err.message);
            }
        };

        fetchFavourites();
    }, [sortOrder]);

    const handleMovieDeleted = (deletedMovieId: number) => {
        setMoviesData(
            moviesData.filter((movie) => movie.id !== deletedMovieId)
        );
    };

    return (
        <div className="favourites-page">
            <div>
                <label htmlFor="sortOrder">Sort by: </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="added">Added Date</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

            <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
                {error && <div>{error}</div>}
                {isPending && <div>Loading...</div>}
                {!isPending && moviesData.length === 0 && (
                    <div>Nothing added to favorites yet!</div>
                )}
                {moviesData &&
                    moviesData.map((movie, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <MovieCard movie={movie} />
                            <DeleteButton
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
