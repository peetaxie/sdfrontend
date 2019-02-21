import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {NgbDate, NgbCalendar,NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  Routes: Object[] =[];
  Record: any =[];
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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  	    var that =this;
    this.httpClient.get("http://ec2-18-191-255-122.us-east-2.compute.amazonaws.com/record").subscribe(
            data => {
                console.log("record data is successful ", data);
                var size = data.length;
                console.log(size);
                that.Record = data;
                // for(var i=0;i<size;i++){
                //    if(typeof that.Record[i]=='undefined'){
                //      that.Record[i] =  [];
                //    }
                //    that.Record[i].push({
                //       "id":"pid"+i+''+that.Record[i].length,
                //       "isopen": false,
                //       "latitude":data[i].Lat,
                //       "longitude":data[i].Long,
                //       "Alt":data[i].Alt,
                //       "Conveyor":data[i].Conveyor,
                //       "GPS_head":data[i].GPS_head,
                //       "Prewet":data[i].Prewet,
                //       "Spinner":data[i].Spinner,
                //       "X_accel":data[i].X_accel,
                //       "Y_accel":data[i].Y_accel,
                //       "Z_accel":data[i].Z_accel,
                //       "time":data[i].time
                //     }); 
                //  }
                 console.log("record",that.Record);
                });
  }
  circleclick(point,windowinfo){
    console.log("point",point);
    console.log("windowinfo",windowinfo);
    this.markPoint.marklat=point.Lat;
    this.markPoint.marklng = point.Long;
    this.markPoint.Alt = point.Alt;
    this.markPoint.GPS_head=point.GPS_head;
    this.markPoint.Acc_mag=point.Acc_mag;
    this.markPoint.Conveyor=point.Conveyor;
    this.markPoint.Spinner=point.Spinner;
    this.markPoint.Prewet=point.Prewet;
    this.markPoint.time=point.time;
    windowinfo.open();
  }

}
