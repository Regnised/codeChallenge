import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Account } from '../types/account';
import { API } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  id = new FormControl('', [Validators.required]);
  apiName = 'api102c3b47';
  errorTab1;
  errorTab2;
  isAccountSaved: boolean;

  account: Account = {} as Account;

  constructor(private fb: FormBuilder) { }

  async ngOnInit() {
  }

  async getAccount(): Promise<void> {
    const params = {
      queryStringParameters:
        {
          id: this.id.value
        }
    };
    try {
      const results = await API.get(this.apiName, '/subscriber', params);
      this.account = results.data.Items[0];
    } catch (e) {
      this.errorTab2 = e.message;
    }
  }

  async onCreate() {
    const data = {
      body: {
        email: this.email.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value
      }
    };
    try {
      await API.post(this.apiName, '/subscriber', data);
      this.email.reset('');
      this.firstName.reset('');
      this.lastName.reset('');
      this.isAccountSaved = true;
    } catch (e) {
      console.log('Error: ', e.message);
      this.errorTab1 = e.message;
      this.isAccountSaved = false;
    }
  }
}
