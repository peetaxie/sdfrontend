import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:String='';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  login(event){
    event.preventDefault();
    const target=event.target;
    const username=target.querySelector('#username').value;
    const password=target.querySelector('#password').value;
    if(username=="user"&&password=="pass"){
      this.router.navigate(['home'])
    }
    else{
      window.alert("wrong password! Please try again");
    }
    console.log(username,password);
  }

}
