//consts

const apiKey = "78ac43009fd64f1f26076f690899034e";
const apiEndPoint = "https://api.themoviedb.org/3";
const apiPaths = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
  fetchMoviesList: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
  fetchTrendingMovies: `${apiEndPoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
  searchOnYoutube: (searchQuery) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=AIzaSyDSqLFilSD0QFdCwRY7BLF4A1NvyuI3F7o`,
};
const imagePath = "https://image.tmdb.org/t/p/original";
//boots up the app
function init() {
  fetchAndBuildSections();
  fetchTrendingMovies();
}

function fetchTrendingMovies() {
  fetchAndBuildMovieSection(apiPaths.fetchTrendingMovies, "Trending Now")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((error) => console.error(error));
}

function buildBannerSection(movie) {
  const bannerCont = document.getElementById("banner-section");
  bannerCont.style.backgroundImage = `url(${imagePath}${movie.backdrop_path})`;

  const div = document.createElement("div");
  div.innerHTML = `
  <h2 class="banner__title">${movie.title}</h2>
  <p class="banner__info">Trending in movies | Release Date- ${
    movie.release_date
  }</p>
  <p class="banner_overview">${
    movie.overview && movie.overview.length > 200
      ? movie.overview.slice(0, 200).trim("") + "..."
      : movie.overview
  }</p>
  <div class="action-buttons-cont">
    <button class="action-button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ltr-0 e1mhci4z1"
        data-name="Play"
        aria-hidden="true"
      >
        <path
          d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
          fill="currentColor"
        ></path></svg
      >&nbsp;Play
    </button>
    <button class="action-button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="ltr-0 e1mhci4z1"
        data-name="Info"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
          fill="currentColor"
        ></path></svg
      >&nbsp;More Info
    </button>
  </div>`;
  div.className = "banner-content container";
  bannerCont.append(div);
}

function searchMovieTrailer(movieName, iframeId) {
  console.log(document.getElementById(iframeId), iframeId);
  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      console.log(res.items[0]);
      const bestResult = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
      document.getElementById(
        iframeId
      ).src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0&&mute=1`;
    })
    .catch((error) => console.error(error));
}

function fetchAndBuildSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) =>
          fetchAndBuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          )
        );
      }
    });
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies;
    })
    .catch((error) => console.error(error));
}

function buildMovieSection(list, categoryName) {
  const moviesCont = document.getElementById("movies-cont");
  const moviesListHtml = list
    .map((item) => {
      return `
      <div class="movie-item" 
      onmouseover="searchMovieTrailer('${item.title}', 'yt${item.id}')">
          <img
          class="movie-item-img"
          src='${imagePath}${item.backdrop_path}'
          alt="${item.title}"
        />
        <iframe
        width="245"
        height="150"
        src=""
        id="yt${item.id}"
      >
      </iframe>
      </div>
    `;
    })
    .join(" ");

  const moviesSectionHtml = `
    <h2 class="movie-section-heading">
      ${categoryName} <span class="explore-nudge">Explore All</span>
    </h2>
    <div class="movies-row">
      ${moviesListHtml}
    </div>
  `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHtml;
  moviesCont.append(div);
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    //header UI update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});
