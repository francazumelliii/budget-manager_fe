import { Component } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { FormGroupService } from '../../Services/form-group.service';
import { ModalService } from '../../Services/modal.service';
import { Page, Pagination, Project, PostProjectRequest, User } from '../../Interfaces/interface';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PaginatorState } from 'primeng/paginator';
import { QuickaccessModalComponent } from '../quickaccess-modal/quickaccess-modal.component';
import { SearchAccountComponent } from '../search-account/search-account.component';
import { AuthenticationService } from '../../Services/authentication.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.sass'
})
export class ProjectComponent {

  constructor(
    private roleService: RoleService,
    private formService: FormGroupService,
    private modalService: ModalService,
    private authService: AuthenticationService
  ) {}

  projectsList: Project[] = [];
  _isSelectVisible: boolean = false;
  filterForm: FormGroup = this.formService.filterForm;
  emails: string[] = [];
  user: User = this.authService.userInformation

  filterList: any = [
    {id: 'name', name: 'NAME'},
    {id: 'goalAmount', name: 'AMOUNT'},
  ];
  
  error: string = '';
  pagination: Pagination = {
    rows: 10,
    first: 0,
    rowsPerPageOptions: [10, 15, 20],
    totalRecords: 0,
  };
  newProjectForm: FormGroup = this.formService.newTripForm;

  ngOnInit(): void {
    this.getProjectPage(0, this.pagination.rows, 'name', 'ASC');
  }
  

  getProjectPage(
    page: number = 0,
    size: number = 10,
    order: string | null = null,
    direction: string | null = null
  ): void {
    const sortOrder = order ?? 'name';
    const sortDirection = direction ?? 'ASC';

    this.roleService
      .allProjectsPaging( page, size, sortOrder, sortDirection)
      .subscribe(
        (response: Page<Project>) => {

          this.projectsList = response.records;
          this.pagination = {
            rows: size,
            first: page * size,
            rowsPerPageOptions: [5, 10, 15],
            totalRecords: response.totalRecords,
          };
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  handlePageChange($event: PaginatorState): void {
    if ($event && $event.page !== undefined) {
      const page = $event.page;
      const rows = $event.rows ?? 10;
      this.getProjectPage(page, rows, 'name');
    } else {
      console.error('Page event is missing or undefined');
    }
  }

  async openModal() {
    const componentRef = await this.modalService.open(
      QuickaccessModalComponent,
      { type: 'trip', responseError: this.error },
      'NEW PROJECT'
    );
    componentRef.instance.submit.subscribe((data: any) => this.addNewProject());
  }

  addNewProject() {
    const name = this.newProjectForm.get('name')?.value;
    const goalAmount = this.newProjectForm.get('goalAmount')?.value;
    const description = this.newProjectForm.get('description')?.value;
    const image = this.newProjectForm.get('image')?.value;

    const body: PostProjectRequest= {
      name: name,
      description: description,
      goalAmount: goalAmount,
      image: image,
    };

    this.roleService.postTrip(body).subscribe(
      (response: Project) => {

        this.projectsList.unshift(response); 
        this.modalService.close();
        this.newProjectForm.reset();
        this.pagination.totalRecords += 1; 
      },
      (error: any) => {
        console.error(error);
        this.error = error;
        this.modalService.updateChildInputs({ responseError: this.error });
      }
    );
  }

  showFilterSelect() {
    this._isSelectVisible = !this._isSelectVisible;
    if (!this._isSelectVisible) {
      this.getExpensePageWithFilters();
    }
  }

  changeDirection() {
    const newDirection = this.filterForm.get("direction")?.value === "ASC" ? "DESC" : "ASC";
    this.filterForm.get("direction")?.setValue(newDirection);
    this.getExpensePageWithFilters();
  }

  getExpensePageWithFilters() {
    const orderBy = this.filterForm.get('orderBy')?.value || 'name';
    const direction = this.filterForm.get('direction')?.value || 'ASC';
    this.getProjectPage(0, this.pagination.rows, orderBy, direction);
  }
 


  isExpired(date: string) {
    return new Date(date) <= new Date();
  }
  formatDate(arg0: string,arg1: string,arg2: string) {
   return formatDate(arg0, arg1,arg2)
  }
  async addNewAccount(project: Project){
    const modalRef = await this.modalService.open(SearchAccountComponent, {project: project}, "ADD NEW ACCOUNT")
    modalRef.instance.success.subscribe((project: Project) => {
      this.projectsList = this.projectsList.map(p =>
        p.id === project.id ? project : p
      );
    });
    
  }
}
