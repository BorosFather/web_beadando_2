import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apihost = 'http://localhost:8000/api/';

  
  constructor(private http : HttpClient) { }

  getEmployees() {
    let endpoint = 'index';
    let url = this.apihost + endpoint;
    
    return this.http.get<any>(url);
  }

  addEmployee(data: any) {

    let endpoint = 'store';
    let url = this.apihost +  endpoint;
    
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'applicaton/json',
      'Authorization': 'Bearer '
    });

    let httpOption = {
      headers: headers
    };
    return this.http.post<any>(url, data, httpOption);
  }

  deleteEmployee(id: number) {
    let endpoint = 'delete';
    let url = this.apihost + endpoint + "/" + id;
   
    return this.http.delete<any>(url);
  }
  updateEmployee(emp: any) {
    let id = emp.id;
    let endpoint = 'employees';
    let url = this.apihost + endpoint + "/" + id;
  
    return this.http.put(url, emp);
  }

}
