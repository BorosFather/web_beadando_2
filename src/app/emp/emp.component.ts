import { Component ,NgZone } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.scss']
})
export class EmpComponent {

  empForm !: FormGroup;
  editForm !: FormGroup;
  emps:any = [];
  message!:any;
  errmess: any;
  employeesPerPage: number = 10;
  currentPage: number = 1;
  totalEmployees: number = 0;
  pageSizes: number[] = [10, 20, 30];
  totalPages: number = 0;
  
  constructor( 
    private api: ApiService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,) { }

  ngOnInit(): void {
    this.empForm = this.formBuilder.group({
      name: ['', Validators.required],
      city: [''],
      salary:[''],
      position_id:[''],
      department_id:[''],
    });

    this.editForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      city: [''],
      salary:[''],
      position_id:[''],
      department_id:[''],

    });
    this.getEmployees();
  }

  showMessage() {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.message = '';
        this.errmess ='';
      }, 4000);
    });
  }

  getEmployees() {
    this.api.getEmployees().subscribe({
      next: (response: any) => {
        this.emps = response.data;
        this.totalEmployees = this.emps.length;//
        this.totalPages = Math.ceil(this.totalEmployees / this.employeesPerPage);//
        this.displayedEmployees();
        this.showMessage();

      },
      error: (err) => {
        console.log('Hiba! A REST API lekérdezés sikertelen!', err);
        
      }
    });
  }

  nextPage() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalEmployees / this.employeesPerPage);//
    this.getEmployees();
  }

  displayedEmployees() {
    const startIndex = (this.currentPage - 1) * this.employeesPerPage;
    const endIndex = startIndex + this.employeesPerPage;
    this.emps = this.emps.slice(startIndex, endIndex);
  }

  // changePage(delta: number) {
  //   this.currentPage += delta;
  //   this.getEmployees();
  // }
  
  onClick() {
    if (this.checkInput()){
    this.addEmployee();
    }
  }

  addEmployee() {
    let data = {
      name: this.empForm.value.name,
      city: this.empForm.value.city,
      salary: this.empForm.value.salary,
      position_id: this.empForm.value.position_id,
      department_id: this.empForm.value.department_id 
    };

    this.clearField();
    this.api.addEmployee(data).subscribe({
      next: (data:any) => {
        console.log('vissza: ' + data);

        this.message = data.message;
        this.getEmployees();
        this.showMessage();
      
      },
      error: (err:any) => {       
       // console.error('Hiba a dolgozó hozzáadása során:', err);
        this.errmess = err.error.message;
        this.showMessage();
      }
    });
  }


  checkInput(): boolean {
    const nameInput = this.empForm.value.name;
    const cityInput = this.empForm.value.city;
    const salaryInput = parseInt(this.empForm.value.salary);
  
    let errorMessage = "";
  
    if (nameInput.trim().length < 5) {
      errorMessage += "Name should be at least 5 characters long!\n";
    }
  
    if (!/^[a-zA-Z\s]+$/.test(nameInput)) {
      errorMessage += "Name should only contain letters and spaces!\n";
    }
  
    if (cityInput.trim().length === 0) {
      errorMessage += "City is required!\n";
    }
  
    if (isNaN(salaryInput) || salaryInput <= 0) {
      errorMessage += "Salary should be a positive number!\n";
    }
  
    if (errorMessage !== "") {
      alert(errorMessage);
      return false;
    }
    return true;
  }
  
  changePage(delta: number) {
    this.currentPage += delta;
    this.getEmployees();
  }

  clearField() {
    this.empForm.patchValue({
        name: '', 
        city: '',
        salary: '',
        position_id:'',
        department_id:'',
    });
  }

  deleteEmp(id: number) {
    this.api.deleteEmployee(id).subscribe({
      next: (res:any) => {
        console.log(res.message);

        this.message = res.message;
        this.getEmployees();
        this.showMessage();
       
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        this.showMessage();
      }
    });
  }

  editEmployee(emp: any) {
    this.editForm.patchValue({id: emp.id});
    this.editForm.patchValue({name: emp.name});
    this.editForm.patchValue({city: emp.city});
    this.editForm.patchValue({salary: emp.salary});
    this.editForm.patchValue({position_id: emp.position_id});
    this.editForm.patchValue({department_id: emp.department_id});

    console.log("megy");
  }

  updateEmployee() {
    let data = {
      id: this.editForm.value.id,
      name: this.editForm.value.name,
      city: this.editForm.value.city,
      salary: this.editForm.value.salary,
      position_id: this.editForm.value.position_id,
      department_id: this.editForm.value.department_id
    };

    this.api.updateEmployee(data).subscribe({
      next: (res:any) => {
        console.log(res.message);
        
        this.message = res.message;
        this.getEmployees();
        this.showMessage();
      
      },
      error: (err) => {
        console.error('Error updating employee:', err);
        this.showMessage();
      }
    });

  }

  
}

