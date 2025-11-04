import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environments.development";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})
export class MovieService {
    private url = environment.baseUrl
    private http = inject(HttpClient)
    getMovies(){
        return this.http.get(`${this.url}movie`)
    }
}