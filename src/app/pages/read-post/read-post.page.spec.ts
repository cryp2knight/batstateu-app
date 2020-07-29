import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReadPostPage } from './read-post.page';

describe('ReadPostPage', () => {
  let component: ReadPostPage;
  let fixture: ComponentFixture<ReadPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadPostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReadPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
