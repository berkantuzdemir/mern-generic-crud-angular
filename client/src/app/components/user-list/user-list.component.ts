import { AfterViewInit, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort,MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { User } from '../../model/user';
import {LiveAnnouncer} from '@angular/cdk/a11y';


interface UserTableModel{
  fullname:string,
  department:string,
  position:string,
  university:string,
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit, AfterViewInit  {
  
   data: User[] = [
    {fullname: 'berkant', department: 'Hydrogen', position: 'asdasdas', university: 'fdsdf', firstJobDay: '2022-08-11T00:00:00.000Z', email: 'fdsdf', description: 'fdsdf', createdAt: 'fdsdf', graduationTime: 'fdsdf', image: 'fdsdf', previousJob: 'fdsdf', previousWorkTitle: 'sadasd', skills:'asdas', totalWorkTime: 'aasdasd', workTitle: 'asdasdsa', __v:'0', _id: '12312' },
    {fullname: 'berka1nt', department: 'Sydro1gen', position: 'asda1sdas', university: 'fddf', firstJobDay: '2022-08-12T00:00:00.000Z', email: 'fdf', description: 'fdf', createdAt: 'fdf', graduationTime: 'fdf', image: 'fdf', previousJob: 'fdf', previousWorkTitle: 'dasd', skills:'aas', totalWorkTime: 'adasd', workTitle: 'asddsa', __v:'1', _id: '1212' },
  ];
  displayedColumns = ['fullname', 'department', 'position','university'];
  dataSource! : MatTableDataSource<UserTableModel>;
  user!: User[]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private Auth: AuthserviceService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
  this.getUsers();
  }

  getUsers() {
  //   this.Auth.getUser().subscribe(data => {
  //     let result = data.map((obj:User)=>{
  //       return  {
  //         'fullname':obj.fullname,
  //         'department':obj.department,
  //         'position':obj.workTitle,
  //         'university':obj.university
  //        } 
  //     }) 
  //     this.dataSource = result
  //     console.log('brn result',result)
  //     console.log('brn',this.dataSource)
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //  })

  let result = this.data.map((obj:User)=>{
    return  {
      'fullname':obj.fullname,
      'department':obj.department,
      'position':obj.workTitle,
      'university':obj.university
     } 
  }) 
  this.dataSource=new MatTableDataSource<UserTableModel>(result)
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
   }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
  } 

  sortData(sort: Sort) {
    console.log(sort)
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '' || this.dataSource.sort ) {
      (this.sort as any) = this.dataSource.sort;
      return;
    }

    this.sort  = (this.dataSource.sort as any)((a:UserTableModel, b:UserTableModel) => {
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