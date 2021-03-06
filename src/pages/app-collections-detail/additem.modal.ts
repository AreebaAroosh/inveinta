import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Item, ItemCollection } from '../../models/Collection';
import { CollectionAttr, RATING_DISPLAY_HELPER } from '../../models/CollectionTypes';

import * as _ from 'lodash';

@Component({
  styles: [`
    rating /deep/ ul.rating { 
      margin: 0 !important;
      padding: 0 !important;
    }

    ion-textarea textarea {
      height: 200px;
    }
  `],
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-buttons start>
          <button color="light" ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>{{ mode === 'add' ? 'Add New Item' : 'Edit Item' }}</ion-title>
      </ion-navbar>

    </ion-header>


    <ion-content padding>
      <ion-list>
        <ion-item *ngFor="let column of columns" [class.hidden]="shouldHideColumn(column)">
          
          <ion-label *ngIf="!isSpecialColumn(column) && shouldStackLabel(column)" stacked> {{ column.name }}</ion-label>
          <ion-label *ngIf="!isSpecialColumn(column) && !shouldStackLabel(column)">{{ column.name }}</ion-label>
          
          <ion-input *ngIf="column.type === 'string' || column.type === 'imageURL'" 
                     type="text"
                     maxlength="100"
                     [placeholder]="column.name" 
                     (keyup.enter)="submit(item)"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-input *ngIf="column.type === 'number'"
                     type="number" 
                     [placeholder]="column.name"
                     (keyup.enter)="submit(item)"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-input *ngIf="column.type === 'money'" 
                     type="number" 
                     [placeholder]="column.name"
                     (keyup.enter)="submit(item)"
                     [(ngModel)]="item[column.prop]"></ion-input>

          <ion-select [(ngModel)]="item[column.prop]" *ngIf="column.type === 'choice'">
            <ion-option *ngFor="let choice of column.options">{{ choice }}</ion-option>
          </ion-select>

          <ion-textarea *ngIf="column.type === 'markdown'" 
                        [(ngModel)]="item[column.prop]" 
                        maxlength="5000"
                        placeholder="Enter a description (markdown supported)"></ion-textarea>

          <ion-toggle *ngIf="column.type === 'boolean' || column.type === 'inline-boolean'" 
                        [(ngModel)]="item[column.prop]"></ion-toggle>
          
          <ion-row no-padding *ngIf="column.type === 'rating'">
            <ion-col no-padding col-2>
              Rating
            </ion-col>
            <ion-col no-padding>
              <rating [(ngModel)]="item[column.prop + 'Value']"></rating>
            </ion-col>
          </ion-row>
        </ion-item>
      </ion-list>
      
    </ion-content>
    
    <ion-footer>
      <ion-toolbar>
        <ion-buttons end>
          <button ion-button (click)="dismiss()">Cancel</button>
          <button ion-button (click)="submit(item)" color="primary" outline [disabled]="!canSubmit()">{{ mode === 'add' ? 'Add Item' : 'Edit Item' }}</button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class AddItemModal implements OnInit {

  public item: any;
  public collection: ItemCollection;
  public columns: CollectionAttr[] = [];

  private mode: 'add'|'edit' = 'add';

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  ngOnInit() {
    this.collection = this.navParams.get('collection');
    this.columns = this.navParams.get('columns');
    this.item = this.navParams.get('item');

    if(this.item) {
      this.mode = 'edit';
    } else {
      this.item = {};
    }
  }

  public shouldHideColumn(attr: CollectionAttr): boolean {
    return _.includes(['computed', 'checkout'], attr.type);
  }

  isSpecialColumn(attr: CollectionAttr): boolean {
    return _.includes(['rating'], attr.type);
  }

  shouldStackLabel(attr: CollectionAttr): boolean {
    return !_.includes(['choice', 'boolean'], attr.type);
  }

  canSubmit(): boolean {
    return !!this.item.name;
  }

  computeItemProperties(): void {
    // coerce booleans so something always displays
    this.columns.forEach(col => {
      if(col.type !== 'boolean') return;
      this.item[col.prop] = !!this.item[col.prop];
    });

    // copy rating values to actual displays
    this.columns.forEach(col => {
      if(col.type !== 'rating') return;
      this.item[col.prop] = RATING_DISPLAY_HELPER(this.item);
    });
  }

  submit(item?: Item) {
    if(!this.canSubmit()) return;
    this.computeItemProperties();
    this.dismiss({ item, mode: this.mode });
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
