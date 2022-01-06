import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/post.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit,OnDestroy {
  posts: Post[] = [];
  getPostSub: Subscription;
  delPostSub: Subscription;
  search: any = '';
  error = '';

  constructor(
    public postService: PostService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getPostSub = this.postService.getPosts().subscribe(posts => {
      this.posts = posts
    }, () => {
      this.error = 'There Is No Posts'
    })
  }

  remove(id) {
    this.postService.deletePosts(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id)
      if (!this.posts.length) {
        this.error = 'There Is No Posts'
      }
      this.alertService.success('Post Removed Successfully');
    }, () => {
      this.alertService.warning('error');
    })
  }

  ngOnDestroy(): void {
    if (this.getPostSub) {
      this.getPostSub.unsubscribe();
    }
    if (this.delPostSub) {
      this.delPostSub.unsubscribe();
    }
  }
}
