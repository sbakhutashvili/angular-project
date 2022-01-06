import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  submitted = false;

  uSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params['id'])
        })
      )
      .subscribe((post: Post) => {
        this.post = post
        this.form.patchValue({
          title: post.title,
          text: post.text
        })
      })
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    })
  }

  submit() {
    if (this.form.invalid) return

    this.submitted = true;

    this.uSub = this.postService.updatePost({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text
    }).subscribe(() => {
      this.submitted = false;
      this.alertService.success('Post Edited')
    }, () => {
      this.alertService.warning('error')
    })
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }
}
