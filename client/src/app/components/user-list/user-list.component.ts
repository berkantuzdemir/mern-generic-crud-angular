import { AfterViewInit, Component, DoCheck, EventEmitter, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { User } from '../../model/user';
import { PopupListComponent } from '../popup-list/popup-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit, AfterViewInit {

  // data: User[] = [
  //   { fullname: 'berkant', department: 'Hydrogen', position: 'Software Intern', university: 'fdsdf', firstJobDay: '2022-08-11T00:00:00.000Z', email: 'fdsdf', description: 'fdsdf', createdAt: '2022-08-11T00:00:00.000Z', graduationTime: '2022-08-11T00:00:00.000Z', image: 'fdsdf', previousJob: 'fdsdf', previousWorkTitle: 'sadasd', skills: 'asdas', totalWorkTime: 'aasdasd', workTitle: 'asdasdsa', __v: '0', _id: '12312' },

  //   { fullname: 'berka1nt', department: 'Sydro1gen', position: 'Font-end Developer', university: 'fddf', firstJobDay: '2022-08-12T00:00:00.000Z', email: 'fdf', description: 'fdf', createdAt: '2022-08-11T00:00:00.000Z', graduationTime: '2022-08-11T00:00:00.000Z', image: 'fdf', previousJob: 'fdf', previousWorkTitle: 'dasd', skills: 'aas', totalWorkTime: 'adasd', workTitle: 'asddsa', __v: '1', _id: '1212' },
  // ];
  displayedColumns = ['checked', 'fullname', 'department', 'position', 'university'];
  clickedRows = new Set<User>();
  dataSource!: MatTableDataSource<User>;
  user!: User[]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private Auth: AuthserviceService, private dialogRef: MatDialog) { }

  openDialog(row: any) {
    const modalRef = this.dialogRef.open(PopupListComponent);
    modalRef.componentInstance.userData = row;
  }


  ngOnInit(): void {
  }

  getUsers() {
      this.Auth.getUser().subscribe(data => {
        this.dataSource = new MatTableDataSource<User>(data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
     })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit(): void {
    if(this.sort == undefined) {
      this.dataSource.sort = this.sort;
    }
  }

  delete(){
    this.dataSource.data = this.dataSource.data.filter((data: any) => !this.clickedRows.has(data));
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '' || this.dataSource.sort) {
      (this.sort as any) = this.dataSource.sort;
      return;
    }


    this.sort = (this.dataSource.sort as any)((a: User, b: User) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fullname':
          return compare(a.fullname, b.fullname, isAsc);
        case 'department':
          return compare(a.department, b.department, isAsc);
        case 'position':
          return compare(a.position, b.position, isAsc);
        case 'university':
          return compare(a.university, b.university, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
