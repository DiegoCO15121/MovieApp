import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments.development";
import { HttpClient } from "@angular/common/http";
import { Movie } from "../interfaces/movie.interface";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private url = environment.baseUrl
    private http = inject(HttpClient)
    getMovies(){
        return this.http.get<Movie[]>(`${this.url}movie`)
    }

    postMovie(payload: Movie){
        return this.http.post(`${this.url}movie`, payload);
    }
    
    deleteMovie(payload: Movie["id"]) {
        return this.http.delete(`${this.url}movie/${payload}`,)
    }
}