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
import { OptionModalComponent } from '../option-modal/option-modal.component';


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
    public authService: AuthenticationService
  ) {}

  projectsList: Project[] = [];
  _isSelectVisible: boolean = false;
  filterForm: FormGroup = this.formService.filterForm;
  emails: string[] = [];
  user: User = this.authService.userInformation
  _isUpdateAllowed: boolean = false;

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
  
  allowUpdate(){
    this._isUpdateAllowed = !this._isUpdateAllowed
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

  redirect(id: number){
    this.authService.redirect(`projects/${id}`)
  }
  async openDeleteModal(id: number){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      title: "Are you sure you want to delete this project?",
      subtitle: "ATTENTION: All the project's expenses will be deleted!",
      description: "The action is irreversible!",
      confirmLabel: "CONFIRM",
      cancelLable: "CANCEL"
    }, "DELETE PROJECT")
    modalRef.instance.confirm.subscribe((data: any) => {
      this.deleteProject(id)
    })
    modalRef.instance.cancel.subscribe((data: any) => {
      this.modalService.close()
    })
  }

  async openEditModal(project: Project){
    this.newProjectForm.get("name")?.setValue(project.name)
    this.newProjectForm.get("description")?.setValue(project.description)
    this.newProjectForm.get("goalAmount")?.setValue(project.goalAmount)
    this.newProjectForm.get("image")?.setValue(project.image)

    const modalRef = await this.modalService.open(QuickaccessModalComponent, {type:"trip", isUpdate: true}, "EDIT TRIP")
    modalRef.instance.submit.subscribe((data: any) => {
      this.patchProject(project.id);
      this.modalService.close()
    })
    
  }

  patchProject(id: number){
    const name = this.newProjectForm.get("name")?.value;
    const description = this.newProjectForm.get("description")?.value;
    const goalAmount = this.newProjectForm.get("goalAmount")?.value;
    const image = this.newProjectForm.get("image")?.value;

    const body: PostProjectRequest = {
      name: name, 
      description: description,
      image: image,
      goalAmount: goalAmount
    }
    this.roleService.patchProject(body,id ) 
      .subscribe((response: Project) => {
        const index = this.projectsList.findIndex(pro => pro.id === id)
        this.projectsList.splice(index, 1)
        this.projectsList.push(response)
      },(error: any ) => {
        console.error(error)
      })
  }

  deleteProject(id: number){
    this.roleService.deleteProject(id)
      .subscribe((response: any) => {
        const index = this.projectsList.findIndex(proj => proj.id == id)
        this.projectsList.splice(index,1)
        this.modalService.close()
      },(error: any) => {
        console.error(error)
      })
  }

  async openExitModal(id: number){
    const modalRef = await this.modalService.open(OptionModalComponent, {
      title: "Are you sure you want to leave this project?",
      subtitle: "All your expenses will be deleted.",
      description: "The expenses you participate in will be redistributed among the other participants.",
      confirmLabel: "CONFIRM",
      cancelLabel: "CANCEL"
    }, "LEAVE PROJECT")

    modalRef.instance.confirm.subscribe((data: any)=> {
      this.removeAccountFromProject(id)
    })
    modalRef.instance.cancel.subscribe((data: any)=> {
      this.modalService.close()
    })
  }

  removeAccountFromProject(projectId: number){
    const email = this.authService.userInformation.email
    this.roleService.removeAccountFromProject(projectId, email)
      .subscribe((response: any)=> {
        const index = this.projectsList.findIndex((p: Project) => p.id === projectId)
        this.projectsList.splice(index,1)
        this.modalService.close()
      })
  }
}
