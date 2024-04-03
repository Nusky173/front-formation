import { Component } from '@angular/core';
import { User } from '../../type/user';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  users: User[] = [];

  newUser?: User;
  editedUser?: User;
  
  isAddingUser: Boolean = false;
  isEditingUser: Boolean = false;

  newUserForm!: FormGroup;
  firstNameError: string = "";
  lastNameError: string = "";
  passwordError: string = "";
  emailError: string = "";

  constructor(private userService: UserService, fb: FormBuilder) {
  }

  ngOnInit() {  
    this.newUserForm = new FormGroup({
      firstName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(8)])
    });

    this.userService.getAllUsers().then((data) => {
      this.users = data;
    })

    this.newUser = {firstName: '', lastName: "", loginCode: "", emailAddress: "", role: ["USER"]}

    
  }

  async _onSubmit() {
    
    this.newUser!.firstName = this.newUserForm.controls['firstName'].value;
    this.newUser!.lastName = this.newUserForm.controls['lastName'].value;
    this.newUser!.emailAddress = this.newUserForm.controls['email'].value;
    this.newUser!.loginCode = this.newUserForm.controls['password'].value;
    this.newUser!.role = ['USER'];

    if(this.isEditingUser) {
      this.newUser!.index = this.editedUser?.index;
      this.newUser!.role = this.editedUser?.role;

      await this.userService.putUser(this.newUser!);

      
      this.isEditingUser = false;
    } else {
      await this.userService.postUser(this.newUser!);

      this.isAddingUser = false;
    }

    
    this._resetForm()

    await this.userService.getAllUsers().then((data) => {
      this.users = data;
    })

   
  }

  _getFirstNameErrorMessage() {
    return this.newUserForm.controls["firstName"].hasError("required") ? 
        "Field is required" :
        "Field must contain at least 3 character"
  }

  _getLastNameErrorMessage() {
    return this.newUserForm.controls["lastName"].hasError("required") ? 
        "Field is required" :
        "Field must contain at least 3 character"
  }

  _getEmailErrorMessage() {
    return this.newUserForm.controls["email"].hasError("required") ? 
        "Field is required" :
        "This is not a valid email adress"
  }

  _getPasswordErrorMessage() {
    return this.newUserForm.controls["password"].hasError("required") ? 
        "Field is required" :
        "Field must contain at least 8 character"
  }

  _resetForm() {
    this.newUserForm.controls['firstName'].setValue("");
    this.newUserForm.controls['lastName'].setValue("");
    this.newUserForm.controls['email'].setValue("");
    this.newUserForm.controls['password'].setValue("");

    this.newUserForm.markAsUntouched();

    this.isAddingUser = false;
    this.isEditingUser = false;
  }

  async deleteUser(user: User) {
    this.userService.deleteUser(user);

    await this.userService.getAllUsers().then((data) => {
      this.users = data;
      console.log(this.users);
    })
  }

  editUser(user: User) {
    this.isEditingUser = true;
    this.editedUser = user;

    this.newUserForm.controls["firstName"].setValue(user.firstName);
    this.newUserForm.controls["lastName"].setValue(user.lastName);
    this.newUserForm.controls["email"].setValue(user.emailAddress);
    this.newUserForm.controls["password"].setValue(user.loginCode);
  }
}
