import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {NgbDate, NgbCalendar,NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private icon={
          url: "../assets/icon/snowplow.png", 
          scaledSize: {
            height: 50,
            width: 50
          },
          anchor:{
            x:25,
            y:25
          }
   };
  title = 'Real Time Route Optimization';
  cars: Object[] = [];  
  positions: Object[] =[];
  diff: Object[] =[];
  Routes: Object[] =[];
  lat: number = 0;
  lng: number = 0;
  markPoint={
      marklat: 0,
      marklng: 0,
      Alt: '',
      GPS_head: '',
      Acc_mag: '',
      Conveyor: '',
      Spinner: '',
      Prewet: '',
      time: '',
  };

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;
  model;
  closeResult: string
  user:String= "public";
  constructor(private httpClient: HttpClient,calendar: NgbCalendar,private modalService: NgbModal) {
      setInterval(() => {
        this.updatadata();
      }, 5000);
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
      this.user=localStorage.getItem("user");
  }


  // truckwindowOpen(infoWindow) {
  //   this._zone.runOutsideAngular(() => {
  //     infoWindow.open();
  //   });
  // }

  // truckwindowClose(infoWindow) {
  //   this._zone.runOutsideAngular(() => {
  //     infoWindow.close();
  //   });
  // }


  circleclick(point,windowinfo){
      console.log(point);
      this.markPoint.marklat=point.latitude;
      this.markPoint.marklng = point.longitude;
      this.markPoint.Alt = point.Alt;
      this.markPoint.GPS_head=point.GPS_head;
      this.markPoint.Acc_mag=point.Acc_mag;
      this.markPoint.Conveyor=point.Conveyor;
      this.markPoint.Spinner=point.Spinner;
      this.markPoint.Prewet=point.Prewet;
      this.markPoint.time=point.time;
      windowinfo.open();
  }

  animatedMove(data){
    var that =this;
    function loop(i) {
    if (i <= 30) {
        for(var a=0;a<data.length;a++){
          var difflat = that.diff[a].Lat;
          var difflong = that.diff[a].Long;
          that.positions[a].Lat += difflat;
          that.positions[a].Long += difflong;
          if(i==30){
            that.positions[a].Lat = data[a].Lat;
            that.positions[a].Long = data[a].Long;
          }
        }
        setTimeout(function() {loop(++i);}, 10);
    }
  }(1);

  loop(0);


  }

  updatadata(){
    var that =this;
    this.httpClient.get("http://ec2-18-191-255-122.us-east-2.compute.amazonaws.com/").subscribe(
            data => {
                console.log("PUT Request is successful ", data);

                var size = data.length;
                for(var i=0;i<size;i++){
                   if(typeof that.Routes[i]=='undefined'){
                     that.Routes[i] =  [];
                   }
                   that.Routes[i].push({
                      "id":"pid"+i+''+that.Routes[i].length,
                      "isopen": false,
                      "latitude":data[i].Lat,
                      "longitude":data[i].Long,
                      "Alt":data[i].Alt,
                      "Conveyor":data[i].Conveyor,
                      "GPS_head":data[i].GPS_head,
                      "Prewet":data[i].Prewet,
                      "Spinner":data[i].Spinner,
                      "X_accel":data[i].X_accel,
                      "Y_accel":data[i].Y_accel,
                      "Z_accel":data[i].Z_accel,
                      "time":data[i].time
                    }); 
                 }
                 console.log("routes",that.Routes);

                if(that.lat==0 && that.lng==0){
                  that.lat = data[0].Lat;
                  that.lng = data[0].Long;
                }

                if(that.positions.length==0){
                  for(var i=0;i<size;i++){
                    var p = new Array();
                    p.Lat = data[i].Lat;
                    p.Long = data[i].Long;
                    that.positions.push(p);
                   }
                }
                else{
                  that.diff = new Array();
                  for(var i=0;i<size;i++){
                    var movetolat = data[i].Lat;
                    var movetolong= data[i].Long;
                    var currlat = that.positions[i].Lat;
                    var currLong = that.positions[i].Long;
                    var difflat = movetolat - currlat;
                    var diffLong = movetolong - currLong;
                    var p = new Array();
                    p.Lat = difflat/30;
                    p.Long = diffLong/30;  
                    that.diff.push(p);
                    }
                   // console.log("different:",that.diff);
                   that.animatedMove(data);
                  }

                  that.cars= new Array(); 
                  for(var i=0;i<size;i++){
                     that.cars.push(data[i]);  
                   }
                  console.log("copy ", that.cars);

                    },
                    error => {
                        console.log("Error", error);
                    });

  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  logout(){
    localStorage.setItem("user","public");
    this.user=localStorage.getItem("user");
  }

  ngOnInit() {
    this.updatadata();
  }
}
