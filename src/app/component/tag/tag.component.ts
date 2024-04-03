import { Component } from '@angular/core';
import { TagService } from '../../service/tag.service';
import { Tag } from '../../type/tag';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TagComponent {

  tags: Tag[] = [];
  
  isAddingNewTag: boolean = false;
  isEditingTag: boolean = false;

  selectedTag: Tag | undefined = undefined;
  deletingTag: Tag | undefined = undefined;
  editingTag: Tag | undefined = undefined;

  newTagForm: FormGroup;

  editTagForm: FormGroup;

  constructor(private tagService: TagService) {
    this.newTagForm = new FormGroup({
      tagValue: new FormControl<string>('', [Validators.required]) 
    })

    this.editTagForm = new FormGroup({
      tagValue: new FormControl<string>('', [Validators.required]) 
    })
  }

  ngOnInit() {
    this.tagService.getAllTags().then((data) => {
      this.tags = data;
    })
  }

  _selectTag(tag: Tag) {
    this.selectedTag = this.selectedTag != tag ? tag : undefined;
  }

  async _createNewTag() {
    const newTag: Tag = {
      value: this.newTagForm.controls["tagValue"].value
    }

    await this.tagService.postTag(newTag);

    await this.tagService.getAllTags().then((data) => {
      this.tags = data;
    })
    
    this.isAddingNewTag = false;
  }

  _editTag() {
    this.isEditingTag = true;
    this.editingTag = this.selectedTag; 

    this.editTagForm.controls["tagValue"].setValue(this.editingTag!.value);
  }

  async _submitEditTag() {
    if(this.editingTag) {
      this.editingTag.value = this.editTagForm.controls["tagValue"].value;

      this.tagService.putTag(this.editingTag);

      this._resetForm();

      await this.tagService.getAllTags().then((data) => {
        this.tags = data;
      })
    }

    this.selectedTag = undefined;
    this.editingTag = undefined
  }

  async _deleteTag() {
    if(this.selectedTag) {
      await this.tagService.deleteTag(this.selectedTag);


    }

    await this.tagService.getAllTags().then((data) => {
      this.tags = data;
    })

    this.selectedTag = undefined;
  }


  _resetForm() {
    this.newTagForm.controls['tagValue'].setValue("");

    this.newTagForm.markAsUntouched();

    this.isAddingNewTag = false;
    this.isEditingTag = false;
  }

}
