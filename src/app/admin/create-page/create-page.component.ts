import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../shared/interfaces';
import {PostService} from '../../shared/post.service';
import {AlertService} from '../shared/services/alert.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {
  form: FormGroup;
  createdSub: Subscription;


  constructor(
    private postService: PostService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required)
    })
  }

  submit() {
    if (this.form.invalid) return;

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date()
    }
    this.createdSub = this.postService.createPosts(post)
      .subscribe(() => {
        this.form.reset();
        this.alertService.success('Post Created');
      }, () => {
        this.alertService.warning('Cannot Create Post')
      })
  }

}
