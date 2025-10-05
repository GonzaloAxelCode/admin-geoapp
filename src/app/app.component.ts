import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { combineLatest, map } from 'rxjs';
import { AppState } from './state/app.state';
import { selectAuth } from './state/selectors/auth.selectors';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  protected readonly darkMode = inject(TUI_DARK_MODE);
  loading$ = combineLatest([
    this.store.select(selectAuth),

  ]).pipe(
    map(([auth]) =>
      auth.loadingCheckAuthenticated
    )
  );
  constructor(private store: Store<AppState>) {


  }
}
