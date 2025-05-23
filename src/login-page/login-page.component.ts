import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../api-calls.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  flag_icon = [
    { flag: '🇮🇳', phoneCode: '+91', colors: ['orange', 'white', 'green'] },
    { flag: '🇺🇸', phoneCode: '+1', colors: ['blue', 'white', 'red'] },
    { flag: '🇨🇦', phoneCode: '+1', colors: ['red', 'white'] },
    { flag: '🇬🇧', phoneCode: '+44', colors: ['red', 'white', 'blue'] },
    { flag: '🇫🇷', phoneCode: '+33', colors: ['blue', 'white', 'red'] },
  ];
  headerText = 'Login to submit feedback';
  showText = '';
  selected_value = this.flag_icon[0];
  input_data = '';
  validation_error = '';
  phoneLogin = false;
  loginData = { phone: '', otp: '' };
  loader = false;
  loginOutro = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.typeHeaderText();
      if (isPlatformBrowser(this.platformId)) localStorage.clear();
    }, 2000);
  }

  handleSubmit() {
    const phone = this.selected_value.phoneCode + this.input_data;
    if (!this.validation_error && !this.loginData.otp) {
      this.loader = true;
      this.api.generateOtp(phone).subscribe(() => {
        localStorage.setItem('phone', phone);
        this.input_data = '';
        setTimeout(() => {
          this.phoneLogin = true;
          this.loader = false;
        }, 2000);
      });
    } else {
      this.loader = true;
      this.api.verifyOtp(this.loginData).subscribe(async (data) => {
        this.loginOutro = true;
        this.loader = false;
        setTimeout(async () => {
          this.router.navigate(['/feedback']);
        }, 2000);
        this.api.modelTrainingApi().subscribe((data)=>{console.log(data,'data')});
      });
    }
  }

  inputValidation(type: string) {
    const isPhone = type === 'phone';
    if (isPhone && !/^[0-9]*$/.test(this.input_data)) {
      this.validation_error = 'Enter a valid Phone';
    } else if (!isPhone && this.input_data.length !== 6) {
      this.validation_error = 'Enter a valid OTP';
    } else {
      this.validation_error = '';
      if (!isPhone) {
        this.loginData = {
          phone: localStorage.getItem('phone') || '',
          otp: this.input_data
        };
      }
    }
  }

  typeHeaderText() {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.headerText.length) {
        this.showText += this.headerText[i++];
      } else {
        clearInterval(interval);
      }
    }, 100);
  }
}