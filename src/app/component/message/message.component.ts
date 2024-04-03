import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { Message } from '../../type/message';
import { User } from '../../type/user';
import { UserService } from '../../service/user.service';
import { TagService } from '../../service/tag.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../type/tag';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  messages: Message[] = [];
  userMessages: Message[] = [];

  users: User[] = [];
  selectedUser: User | undefined = undefined;

  tags: Tag[] = [];
  selectedTags: Tag[] = [];

  selectedMessage: Message | undefined;

  newMessageForm: FormGroup;
  editMessageForm: FormGroup;

  messageToSend: Message | undefined;
  messageToEdit: Message | undefined;

  isCreatingMessage: boolean = false;
  isEditingMessage: boolean = false;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA] as const;

  @ViewChild('tagInput')
  tagInput!: ElementRef<HTMLInputElement>;

  constructor(
    private messageService: MessageService, 
    private userService: UserService, 
    private tagService: TagService) 
    {
      this.newMessageForm = new FormGroup({
        value: new FormControl<string>("", [Validators.required]),
        tags: new FormControl<Tag[]>([{value: ""}], [])
      })

      this.editMessageForm = new FormGroup({
        value: new FormControl<string>("", [Validators.required]),
        tags: new FormControl<Tag[]>([{value: ""}], [])
      })
    }

  async ngOnInit() {
    await this.userService.getAllUsers().then((data) => {
      this.users = data;
    })

    this._getAllMessage()

    await this.tagService.getAllTags().then((data) => {
      this.tags = data;
    })
  }

  async getUserMessage() {
    if(this.selectedUser) {
      this.selectedMessage = undefined;
      await this.messageService.getAllMessageOfUser(this.selectedUser).then((data) => {
        this.userMessages = data;
      })
      this.isEditingMessage = false;
    }
  }

  addTag(event: MatChipInputEvent): void {
    console.log(event);
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      const tag = this.tags.find((e) => {
        return e.value == value
      });

      tag != undefined ? this.selectedTags.push(tag) : null;
    }

    // Clear the input value
    event.chipInput!.clear();

    this.newMessageForm.controls['tags'].setValue(null)
  }

  removeTag(tag: Tag): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event); 

    this.selectedTags.push(event.option.value as Tag);
    this.tagInput.nativeElement.value = '';
    this.newMessageForm.controls['tags'].setValue(null);
  }

  _selectMessage(message: Message) {
    this.selectedMessage = message;
  }

  async _deleteMessage() {
    if(this.selectedMessage) {
      await this.messageService.deleteMessage(this.selectedMessage);

      await this.messageService.getAllMessageOfUser(this.selectedUser!).then((data) => {
        this.userMessages = data;
      })
    }

    this._getAllMessage()
  }

  async _submit() {
    this.messageToSend = {
      text: this.newMessageForm.controls["value"].value,
      owner: this.selectedUser!,
      tagList: this.selectedTags
    }

    const message = await this.messageService.postMessage(this.messageToSend);

    console.log(message);

    this._getAllMessage();
    
    this._resetForm()
  }

  _editMessage() {
    if(this.selectedMessage) {
      this.isEditingMessage = true;
      const selectedMessage = this.selectedMessage;
      console.log(selectedMessage);

      this.editMessageForm.controls['value'].setValue(selectedMessage.text);
      this.editMessageForm.controls['tags'].setValue(selectedMessage.tagList);
      this.selectedTags = selectedMessage.tagList;
    }
  }

  async _submitEditMessage() {
    this.messageToEdit = {
      text: this.editMessageForm.controls["value"].value,
      owner: this.selectedUser!,
      tagList: this.selectedTags,
      index: this.selectedMessage?.index
    }

    const message = await this.messageService.putMessage(this.messageToEdit);

    console.log(message);

    this._getAllMessage();
    
    this._resetForm()
  }

  _resetForm() {
    this.newMessageForm.controls['value'].setValue("");
    this.newMessageForm.controls["tags"].setValue([]);

    this.editMessageForm.controls['value'].setValue("");
    this.editMessageForm.controls["tags"].setValue([]);

    this.newMessageForm.markAsUntouched();

    this.isCreatingMessage = false;
    this.isEditingMessage = false;
    this.selectedUser = undefined;
  }

  async _getAllMessage() {
    await this.messageService.getAllMessages().then((data) => this.messages = data)

  }
}
