import { Component,OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { Class, Course } from '../models/treeview.model';
import { StudentService } from '../student/student.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';

interface ExampleFlatNode {
  tid:number;
  expandable: boolean;
  name: string;
  level: number;
}
interface FoodNode {
  tid:number;
  id: string;
  name: string;
  children?: FoodNode[];
}
@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrl: './treeview.component.css'
})

export class TreeviewComponent implements OnInit{
  courseId!:number;
  classId!:number;
  sectionId!:number;
  showeditcourse:boolean=false;
  showeditclass:boolean=false;
  showeditsection:boolean=false;
  func1(node: any) {
    if(node.name=='Courses'){
      this.showaddcourse=true;
      this.showeditcourse=false;
      this.showeditclass=false;
    }
    if (node.level==1) {
      this.courseId=node.tid;
      if(this.courseId!=undefined)
        this.showeditcourse=true;
      this.showeditclass=false;
      this.showaddcourse=false;
    }
    if(node.level==2){
      this.classId=node.tid;
      if(this.classId!=undefined)
        this.showeditclass=true;
      this.showeditcourse=false;
      this.showaddcourse=false;
    }
  }
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      tid:node.tid
    };
  };
  ngOnInit() {
    
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private studentService:StudentService,private router:Router) {
    this.studentService.gettree().subscribe((data)=>{
      this.dataSource.data = data;
    })
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  btnClick(){
    this.router.navigateByUrl('students/course');
  }
  showaddcourse:boolean=false;
  func(node:any){
    if(node.name=='Courses')
      this.showaddcourse=true;
  }
}
