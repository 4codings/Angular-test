import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  id?: String,
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  memberId = '';

  constructor(
    private fb: FormBuilder,           
    private appService: AppService, 
    private router: Router,
    private route: ActivatedRoute
  ) {   
  }

  ngOnInit() {
    this.memberForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      team: ['', [Validators.required]]
    });
    
    this.appService.getTeams().subscribe(teams=> {
      this.teams = teams;
    })
    this.route.params.subscribe(params => {
      if (params.id) {
        this.memberId = params.id;
        this.appService.getMember(this.memberId).subscribe((member) => {
          this.memberForm.setValue(member)
        })
      }
    })
  }

  deleteMember() {
    this.appService.removeMember(this.memberId).subscribe(()=>{
      this.router.navigate(['/members']);
    });
  }

  ngOnChanges() {
  }

  // TODO: Add member to members
  submitForm() {
    this.submitted = true;
    if (this.memberForm.valid) {
      if (this.memberId) {
        this.appService.updateMember(this.memberForm.value).subscribe(()=> {
          this.router.navigate(['/members']);
        })
      } else {
        this.appService.addMember(this.memberForm.value).subscribe(()=>{
          this.router.navigate(['/members']);
        });
      }
    }
    }
}
